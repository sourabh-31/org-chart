import { convertChartData } from "@/lib/utils";
import { create } from "zustand";

interface BaseNode {
  id: string;
  children: ChartNode[];
}

export interface OrganisationNode extends BaseNode {
  type: "organisation";
  orgName: string;
  location: string;
  notes: number;
  imgSrc: string | null;
}

export interface PersonNode extends BaseNode {
  type: "person" | string;
  memberName: string;
  role: string;
  location: string;
  notes: number;
  color: string;
  imgSrc: string;
  isStarred: boolean;
  email: string;
  phoneNumber: string;
  isWhatsapp: boolean;
  linkedIn: string;
  manager: string;
  department: string;
  parentId?: string;
}

export interface DepartmentNode extends BaseNode {
  type: "department";
  departmentName: string;
  notes: number;
  color: string;
  email: string;
  phoneNumber: string;
  isWhatsapp: boolean;
  linkedIn: string;
  manager: string;
  department: string;
}

export interface LocationNode extends BaseNode {
  type: "location";
  locationName: string;
  notes: number;
  color: string;
  email: string;
  phoneNumber: string;
  isWhatsapp: boolean;
  linkedIn: string;
  manager: string;
  department: string;
}

export type ChartNode =
  | OrganisationNode
  | PersonNode
  | DepartmentNode
  | LocationNode;

interface Note {
  id: string;
  title: string;
  note: string;
  type: string;
  addedBy: string;
  dateAdded: string;
  nodeId: string | number;
}

interface ChartStore {
  chartData: ChartNode;
  rerender: number;
  selectedData: ChartNode | {};
  selectedNote: Note | {};
  resetSelectedNote: () => void;
  notes: Note[];
  addNode: (parentId: string, newNode: ChartNode) => void;
  findAndSetNodeById: (id: string) => void;
  findAndSetNoteById: (id: string) => void;
  resetSelectedNode: () => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (
    nodeId: string,
    parentId: string,
    isMoveAll: boolean,
    prevParentId: string
  ) => void;
  addNote: (newNote: Note) => void;
  deleteNote: (noteId: string) => void;
  updateNote: (updatedNote: Note) => void;
}

const initialChartData: OrganisationNode = {
  id: "1",
  orgName: "Google Search Private Limited",
  location: "Bengaluru",
  notes: 10,
  imgSrc: "/assets/svg/my-brands/org-icon.svg",
  type: "organisation",
  children: [
    {
      id: "2",
      memberName: "Thara Selvan",
      role: "Market Ops - Manager L1",
      location: "Bengaluru",
      notes: 0,
      color: "#ffffff",
      email: "tharaselvan@thecompanyname.com",
      phoneNumber: "+91 99999 99999",
      isWhatsapp: true,
      linkedIn: "www.linkedin.com/tharaselvan",
      manager: "None(Self-managed)",
      department: "NA",
      imgSrc: "/assets/png/member1.png",
      type: "person",
      isStarred: false,
      children: [],
    },
    {
      id: "3",
      memberName: "Anbarsan Krishnan",
      role: "Chief Marketing Officer",
      location: "Bengaluru",
      notes: 0,
      color: "#ffffff",
      email: "anbarsankrishnan@thecompanyname.com",
      phoneNumber: "+91 99999 99999",
      isWhatsapp: true,
      linkedIn: "www.linkedin.com/anbarsankrishnan",
      manager: "None(Self-managed)",
      department: "NA",
      imgSrc: "/assets/png/member2.png",
      type: "person",
      isStarred: false,
      children: [
        {
          id: "5",
          departmentName: "Marketing",
          color: "#b1d0a5",
          type: "department",
          email: "marketing@thecompanyname.com",
          phoneNumber: "+91 93949 144979",
          isWhatsapp: true,
          linkedIn: "",
          manager: "Anbarsan Krishnan",
          department: "NA",
          notes: 0,
          children: [
            {
              id: "6",
              memberName: "Arul Mozhi",
              role: "Marketing Manager",
              location: "Bengaluru",
              notes: 0,
              color: "#ffffff",
              imgSrc: "/assets/png/member4.png",
              type: "person",
              email: "arulmozhi@thecompanyname.com",
              phoneNumber: "+91 92999 144979",
              isWhatsapp: true,
              linkedIn: "www.linkedin.com/arulmozhi",
              manager: "Anbarsan Krishnan",
              department: "NA",
              isStarred: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "4",
      memberName: "Aravind Anbu",
      role: "Business Development - Manager L1",
      location: "Bengaluru",
      notes: 0,
      color: "#ffffff",
      imgSrc: "/assets/png/member3.png",
      type: "person",
      email: "aravindanbu@thecompanyname.com",
      phoneNumber: "+91 92999 144979",
      isWhatsapp: true,
      linkedIn: "www.linkedin.com/aravindanbu",
      manager: "None(Self-managed)",
      department: "NA",
      isStarred: true,
      children: [],
    },
  ],
};

const getInitialNotes = (): Note[] => {
  try {
    const storedNotes = localStorage.getItem("notes");
    return storedNotes ? JSON.parse(storedNotes) : [];
  } catch (error) {
    return [];
  }
};

// Chart store
export const useChartStore = create<ChartStore>((set) => ({
  chartData: initialChartData,
  rerender: 1,
  selectedData: {},
  selectedNote: {},
  notes: getInitialNotes(),
  addNode: (parentId: string, newNode: ChartNode) =>
    set((state) => {
      // Retrieve the latest chartData from localStorage
      const storedData = localStorage.getItem("updatedData");
      const latestChartData = storedData
        ? JSON.parse(storedData)
        : state.chartData;

      // Add the new node to the latest chart data
      const updatedData = addNodeToChart(latestChartData, parentId, newNode);

      // Convert data (if necessary) and save both to localStorage
      const convertedData = convertChartData(updatedData);
      localStorage.setItem("updatedData", JSON.stringify(updatedData));
      localStorage.setItem("convertedData", JSON.stringify(convertedData));

      return {
        chartData: updatedData,
      };
    }),
  addNote: (newNote: Note) =>
    set((state) => {
      const updatedNotes = [...state.notes, newNote];

      localStorage.setItem("notes", JSON.stringify(updatedNotes));

      return {
        ...state,
        notes: updatedNotes,
      };
    }),
  deleteNote: (noteId: string) =>
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== noteId);

      localStorage.setItem("notes", JSON.stringify(updatedNotes));

      return {
        ...state,
        notes: updatedNotes,
        selectedNote:
          state.selectedNote && (state.selectedNote as Note).id === noteId
            ? {}
            : state.selectedNote,
      };
    }),
  updateNote: (updatedNote: Note) =>
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );

      localStorage.setItem("notes", JSON.stringify(updatedNotes));

      return {
        ...state,
        notes: updatedNotes,
        selectedNote:
          state.selectedNote &&
          (state.selectedNote as Note).id === updatedNote.id
            ? updatedNote
            : state.selectedNote,
      };
    }),
  findAndSetNodeById: (id: string) =>
    set((state) => {
      const foundNode = findNodeById(id);

      return {
        ...state,
        selectedData: foundNode || {},
      };
    }),
  findAndSetNoteById: (id: string) =>
    set((state) => {
      const foundNote = state.notes.find((note) => note.id === id);

      return {
        ...state,
        selectedNote: foundNote || {},
      };
    }),
  resetSelectedNote: () =>
    set((state) => ({
      ...state,
      selectedNote: {},
    })),
  resetSelectedNode: () =>
    set((state) => ({
      ...state,
      selectedData: {},
    })),
  deleteNode: (nodeId: string) =>
    set((state) => {
      const storedData = localStorage.getItem("updatedData");
      const latestChartData = storedData
        ? JSON.parse(storedData)
        : state.chartData;

      // Delete the node and promote its children (if applicable)
      const updatedData = deleteNodeFromChart(latestChartData, nodeId);

      const newChartData = updatedData || state.chartData;
      localStorage.setItem("updatedData", JSON.stringify(newChartData));
      const convertedData = convertChartData(newChartData);
      localStorage.setItem("convertedData", JSON.stringify(convertedData));

      return {
        chartData: newChartData,
      };
    }),
  moveNode: (
    nodeId: string,
    newParentId: string,
    isMoveAll: boolean,
    prevParentId: string
  ) =>
    set((state) => {
      const storedData = localStorage.getItem("updatedData");
      const latestChartData = storedData
        ? JSON.parse(storedData)
        : state.chartData;

      // Don't allow moving a node to itself or if IDs are the same
      if (nodeId === newParentId) {
        return { chartData: latestChartData };
      }

      // Step 1: Find and remove the node from its current location
      const { nodeToMove, updatedTreeWithoutNode, childrenToRelocate } =
        removeNodeFromTree(latestChartData, nodeId, isMoveAll);

      if (!nodeToMove || !updatedTreeWithoutNode) {
        return { chartData: latestChartData }; // Node not found or root node, return original data
      }

      // Step 2: If isMoveAll is false, add children to previous parent
      let finalUpdatedTree = updatedTreeWithoutNode;
      if (!isMoveAll && childrenToRelocate.length > 0 && prevParentId) {
        finalUpdatedTree = addChildrenToPreviousParent(
          updatedTreeWithoutNode,
          prevParentId,
          childrenToRelocate
        );
      }

      // Step 3: Add the node (without children if isMoveAll is false) to the new parent
      const nodeToAdd = isMoveAll
        ? nodeToMove
        : { ...nodeToMove, children: [] };
      const updatedTreeWithMovedNode = addNodeToChart(
        finalUpdatedTree,
        newParentId,
        nodeToAdd
      );

      // Step 4: Update localStorage and return new state
      const convertedData = convertChartData(updatedTreeWithMovedNode);
      localStorage.setItem(
        "updatedData",
        JSON.stringify(updatedTreeWithMovedNode)
      );
      localStorage.setItem("convertedData", JSON.stringify(convertedData));

      return {
        rerender: Math.random(),
        chartData: updatedTreeWithMovedNode,
      };
    }),
}));

// Helper function to add node to the chartData tree
const addNodeToChart = (
  chartData: ChartNode,
  parentId: string,
  newNode: ChartNode
): ChartNode => {
  if (chartData.id === parentId) {
    return {
      ...chartData,
      children: [...chartData.children, newNode],
    };
  }
  return {
    ...chartData,
    children: chartData.children.map((child) =>
      addNodeToChart(child, parentId, newNode)
    ),
  };
};

// Find node and put it in selectedNode
const findNodeById = (id: string): ChartNode | null => {
  const storedData = localStorage.getItem("convertedData");
  if (!storedData) {
    return null;
  }

  const chartNodes = JSON.parse(storedData).nodes;
  const foundNode = chartNodes.find((node: any) => node.id === id);
  return foundNode ? foundNode.data : null;
};

// Delete node from chart
const deleteNodeFromChart = (
  chartData: ChartNode,
  nodeId: string
): ChartNode | null => {
  if (chartData.id === nodeId) {
    if (chartData.children.length > 0) {
      return chartData.children as unknown as ChartNode;
    }
    return null;
  }

  // Recursive case: Traverse the tree, checking the children
  const updatedChildren = chartData.children
    .map((child) => deleteNodeFromChart(child, nodeId))
    .flat()
    .filter(Boolean) as ChartNode[];

  return {
    ...chartData,
    children: updatedChildren,
  };
};

const removeNodeFromTree = (
  chartData: ChartNode,
  nodeId: string,
  isMoveAll: boolean
): {
  nodeToMove: ChartNode | null;
  updatedTreeWithoutNode: ChartNode | null;
  childrenToRelocate: ChartNode[];
} => {
  if (chartData.id === nodeId) {
    const childrenToRelocate = isMoveAll ? [] : [...chartData.children];
    const nodeToMove = {
      ...chartData,
      children: isMoveAll ? chartData.children : [],
    };
    return {
      nodeToMove,
      updatedTreeWithoutNode: null,
      childrenToRelocate,
    };
  }

  const updatedChildren: ChartNode[] = [];
  let nodeToMove: ChartNode | null = null;
  let childrenToRelocate: ChartNode[] = [];

  for (let i = 0; i < chartData.children.length; i += 1) {
    const child = chartData.children[i];
    const result = removeNodeFromTree(child, nodeId, isMoveAll);

    if (result.nodeToMove) {
      nodeToMove = result.nodeToMove;
      childrenToRelocate = result.childrenToRelocate;
      if (result.updatedTreeWithoutNode) {
        updatedChildren.push(result.updatedTreeWithoutNode);
      }
    } else {
      updatedChildren.push(child);
    }
  }

  if (!nodeToMove) {
    return {
      nodeToMove: null,
      updatedTreeWithoutNode: chartData,
      childrenToRelocate: [],
    };
  }

  return {
    nodeToMove,
    updatedTreeWithoutNode: {
      ...chartData,
      children: updatedChildren,
    },
    childrenToRelocate,
  };
};

const addChildrenToPreviousParent = (
  chartData: ChartNode,
  prevParentId: string,
  childrenToRelocate: ChartNode[]
): ChartNode => {
  if (chartData.id === prevParentId) {
    return {
      ...chartData,
      children: [...chartData.children, ...childrenToRelocate],
    };
  }

  return {
    ...chartData,
    children: chartData.children.map((child) =>
      addChildrenToPreviousParent(child, prevParentId, childrenToRelocate)
    ),
  };
};
