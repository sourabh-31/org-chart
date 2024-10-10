import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertChartData = (chartData: any) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  const managers: { id: string; name: string; type: string }[] = [];
  const people: { id: string; name: string; role: string; type: string }[] = [];

  const calculateDirectChildCounts = (node: any): [number, number] => {
    let personCount = 0;
    let deptLocationCount = 0;

    for (const child of node.children) {
      if (child.type === "person") {
        personCount += 1;
      } else if (child.type === "department" || child.type === "location") {
        deptLocationCount += 1;
      }
    }

    return [personCount, deptLocationCount];
  };

  const processNode = (
    node: any,
    parentId = null,
    parentName = "",
    ancestorColor = ""
  ) => {
    let nodeType = "customChildNode";
    let dimensions = { width: 300, height: 150 };

    if (node.type === "organisation") {
      nodeType = "customMainNode";
    } else if (node.type === "department" || node.type === "location") {
      nodeType = "customSmallNode";
      dimensions = { width: 300, height: 50 };
    }

    let color = node.color || "";
    if (node.type === "department" || node.type === "location") {
      ancestorColor = color;
    } else if (node.type === "person" && ancestorColor !== "") {
      color = ancestorColor;
    }

    // Add to people array if the node is a person
    if (node.type === "person") {
      let fullName = node.memberName;
      if (parentName) {
        fullName = `${parentName} > ${fullName}`;
      }

      people.push({
        id: node.id,
        name: fullName,
        role: node.role || "",
        type: "person",
      });
    }

    const [directPerson, directDeptAndLocation] =
      calculateDirectChildCounts(node);

    nodes.push({
      id: node.id,
      data: {
        id: node.id,
        memberName:
          "memberName" in node
            ? node.memberName
            : "orgName" in node
              ? node.orgName
              : "departmentName" in node
                ? node.departmentName
                : "locationName" in node
                  ? node.locationName
                  : "",
        role: "role" in node ? node.role : "",
        location: "location" in node ? node.location : "",
        imgSrc: "imgSrc" in node ? node.imgSrc : "",
        notes: node.notes,
        color,
        email: "email" in node ? node.email : "",
        phoneNumber: "phoneNumber" in node ? node.phoneNumber : "",
        isWhatsapp: "isWhatsapp" in node ? node.isWhatsapp : false,
        linkedIn: "linkedIn" in node ? node.linkedIn : "",
        manager: "manager" in node ? node.manager : "",
        department: "department" in node ? node.department : "",
        isStarred: "isStarred" in node ? node.isStarred : false,
        type: "type" in node ? node.type : "",
        dimensions,
        directPerson,
        directDeptAndLocation,
        parentId,
      },
      position: { x: 0, y: 0 },
      type: nodeType,
    });

    if (node.type === "organisation") {
      managers.push({
        id: node.id,
        name: "None (Self-managed)",
        type: "",
      });
    }

    if (parentId === null) {
      if (node.type === "person") {
        managers.push({
          id: node.id,
          name: node.memberName,
          type: "Person",
        });
      } else if (node.type === "department") {
        managers.push({
          id: node.id,
          name: node.departmentName,
          type: "Department",
        });
      } else if (node.type === "location") {
        managers.push({
          id: node.id,
          name: node.locationName,
          type: "Location",
        });
      }
    } else {
      let fullName = "";
      let type = "";
      let id = "";

      if (node.type === "person") {
        fullName = node.memberName;
        type = "Person";
        id = node.id;
      } else if (node.type === "department") {
        fullName = node.departmentName;
        type = "Department";
        id = node.id;
      } else if (node.type === "location") {
        fullName = node.locationName;
        type = "Location";
        id = node.id;
      }

      if (fullName && parentName) {
        fullName = `${parentName} > ${fullName}`;
      }

      if (fullName) {
        managers.push({
          id,
          name: fullName,
          type,
        });
      }
    }

    if (parentId) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
      });
    }

    node.children.forEach((child: any) =>
      processNode(
        child,
        node.id,
        node.memberName || node.departmentName || node.locationName,
        ancestorColor
      )
    );
  };

  processNode(chartData);

  return { nodes, edges, managers, people };
};
