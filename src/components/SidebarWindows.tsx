"use client";

import { Sidebar } from "./shared/Sidebar";
import AddDepartment from "./AddDepartment";
import AddLocation from "./AddLocation";
import AddPerson from "./AddPerson";
import Details from "./Details";

export default function SidebarWindows() {
  return (
    <>
      {/* Add Person */}
      <Sidebar.Window
        name="add-person"
        title="Add New"
        subText="Google Search Private Limited"
        isBorderedIcon={false}
      >
        <AddPerson />
      </Sidebar.Window>

      {/* Add department */}
      <Sidebar.Window
        name="add-department"
        title="Add New"
        subText="Google Search Private Limited"
        isBorderedIcon={false}
      >
        <AddDepartment />
      </Sidebar.Window>

      {/* Add location */}
      <Sidebar.Window
        name="add-location"
        title="Add New"
        subText="Google Search Private Limited"
        isBorderedIcon={false}
      >
        <AddLocation />
      </Sidebar.Window>

      {/* People details */}
      <Sidebar.Window
        name="people-details"
        title="People Details"
        icon1="/assets/svg/people-details/edit-pencil.svg"
        icon2="/assets/svg/people-details/more-alt.svg"
        isBorderedIcon
        className="w-96"
      >
        <Details name="people-details" />
      </Sidebar.Window>

      {/* Department details */}
      <Sidebar.Window
        name="department-details"
        title="Department Details"
        icon1="/assets/svg/people-details/edit-pencil.svg"
        icon2="/assets/svg/people-details/more-alt.svg"
        isBorderedIcon
        className="w-96"
      >
        <Details name="department-details" />
      </Sidebar.Window>

      {/* Location details */}
      <Sidebar.Window
        name="location-details"
        title="Location Details"
        icon1="/assets/svg/people-details/edit-pencil.svg"
        icon2="/assets/svg/people-details/more-alt.svg"
        isBorderedIcon
        className="w-96"
      >
        <Details name="location-details" />
      </Sidebar.Window>
    </>
  );
}
