import React, { Component } from 'react'


import OfflineTable from 'react-offline-table';

import moment from 'moment';

export default function AllOrders(props) {

    // viewEmployee(selectedEmployeeID) {
    //         console.log("View Employee")
    //         console.log(selectedEmployeeID)
    // }

    // editEmployee(selectedEmployeeID) {
    //         console.log("Edit Employee")
    //         console.log(selectedEmployeeID)
    // }

    // changeStatus(newStatus, employee) {
    //         console.log("Status changed")
    // }

    // render() {

    //         const headerFields = [
    //                 {
    //                         id: 0,
    //                         type: "action",
    //                         align: "text-center",
    //                         name: "ACTIONS"
    //                 },
    //                 {
    //                         id: 1,
    //                         type: "dropdown",
    //                         align: "text-left",
    //                         name: "CHANGE STATUS"
    //                 },
    //                 {
    //                         id: 2,
    //                         type: "text",
    //                         sort: "sorting_asc",
    //                         align: "text-left",
    //                         name: "ID"
    //                 },
    //                 {
    //                         id: 3,
    //                         type: "media",
    //                         sort: "sorting",
    //                         align: "text-left",
    //                         name: "EMPLOYEE"
    //                 },
    //                 {
    //                         id: 4,
    //                         type: "text",
    //                         sort: "sorting",
    //                         align: "text-left",
    //                         name: "DATE OF BIRTH"
    //                 },
    //                 {
    //                         id: 5,
    //                         type: "badge",
    //                         sort: "sorting",
    //                         align: "text-left",
    //                         name: "STATUS"
    //                 }
    //         ];

    //         const employeeData = [
    //                 {
    //                         emp_id: 1,
    //                         status: "Main",
    //                         name: "Tony Stark",
    //                         profile_picture: null,
    //                         dob: "April 4, 1965",
    //                         played_by: "Robert Downey, Jr."

    //                 },
    //                 {
    //                         emp_id: 2,
    //                         status: "Villain",
    //                         name: "Justin Hammer",
    //                         profile_picture: null,
    //                         dob: "November 5, 1968",
    //                         played_by: "Sam Rockwell"

    //                 },
    //                 {
    //                         emp_id: 3,
    //                         status: "Villain",
    //                         name: "Whiplash",
    //                         profile_picture: null,
    //                         dob: "September 16, 1952",
    //                         played_by: "Mickey Rourke"

    //                 },
    //                 {
    //                         emp_id: 4,
    //                         status: "Support",
    //                         name: "Happy Hogan",
    //                         profile_picture: null,
    //                         dob: "October 19, 1966",
    //                         played_by: "Jon Favreau"

    //                 },
    //                 {
    //                         emp_id: 5,
    //                         status: "Main",
    //                         name: "Thor",
    //                         profile_picture: null,
    //                         dob: "August 11, 1983",
    //                         played_by: "Chris Hemsworth"

    //                 },
    //                 {
    //                         emp_id: 6,
    //                         status: "Main",
    //                         name: "Captain America",
    //                         profile_picture: null,
    //                         dob: "June 13, 1981",
    //                         played_by: "Chris Evans"

    //                 },
    //                 {
    //                         emp_id: 7,
    //                         status: "Support",
    //                         name: "Howard Stark",
    //                         profile_picture: null,
    //                         dob: "June 2, 1978",
    //                         played_by: "Dominic Cooper"

    //                 },
    //                 {
    //                         emp_id: 8,
    //                         status: "Support",
    //                         name: "Pepper Potts",
    //                         profile_picture: null,
    //                         dob: "September 27, 1972",
    //                         played_by: "Gwyneth Paltrow"

    //                 },
    //                 {
    //                         emp_id: 9,
    //                         status: "Main",
    //                         name: "Natasha Romanoff",
    //                         profile_picture: null,
    //                         dob: "November 22, 1984",
    //                         played_by: "Scarlett Johansson"

    //                 },
    //                 {
    //                         emp_id: 10,
    //                         status: "Main",
    //                         name: "Bruce Banner",
    //                         profile_picture: null,
    //                         dob: "November 22, 1967",
    //                         played_by: "Mark Ruffalo"

    //                 },
    //         ];

    //         const EmployeeStatus = [
    //                 { value: "probation", label: "Probation" },
    //                 { value: "current", label: "Permanent" },
    //                 { value: "resign", label: "Resign" },
    //                 { value: "layoff", label: "LayOff" },
    //         ];

    //         const pages = [
    //                 { value: 5, label: '5' },
    //                 { value: 10, label: '10' },
    //                 { value: 20, label: '20' },
    //                 { value: 50, label: '50' },
    //                 { value: 100, label: '100' }
    //         ]

    //         const colors = {
    //                 a: "#2196f3",
    //                 b: "#ec407a",
    //                 c: "#ff9800",
    //                 d: "#66bb6a",
    //                 e: "#5c6bc0",
    //                 f: "#ef5350",
    //                 g: "#8d6e63",
    //                 h: "#26a59a",
    //                 i: "#ff9b12",
    //                 j: "#343434",
    //                 k: "#39589e",
    //                 l: "#7886cb",
    //                 m: "#26a59a",
    //                 n: "#6A1B9A",
    //                 o: "#283593",
    //                 p: "#5C6BC0",
    //                 q: "#4db6ab",
    //                 r: "#444444",
    //                 s: "#888888",
    //                 t: "#37474F",
    //                 u: "#4E342E",
    //                 v: "#FF7043",
    //                 w: "#263238",
    //                 x: "#009688",
    //                 y: "#00bcd4",
    //                 z: "#8BC34A"
    //         };






    //         var _data = []

    //         for (var i = 0; i < employeeData.length; i++) {
    //                 var row = [];

    //                 // Column 1
    //                 const actions = [
    //                         { icon: "fas fa-eye text-success-600 cursor-pointer mr-2", callBack: this.viewEmployee.bind(this, employeeData[i].emp_id) },
    //                         { icon: "fas fa-edit text-info-600 cursor-pointer", callBack: this.editEmployee.bind(this, employeeData[i].emp_id) }
    //                 ]
    //                 row.push(actions)

    //                 // Column 2
    //                 row.push({ text: "Change Status", selected: employeeData[i].status, options: EmployeeStatus, onClick: this.changeStatus, onClickArg: employeeData[i] })

    //                 // Column 3
    //                 row.push(employeeData[i].emp_id ? employeeData[i].emp_id : "N/A");

    //                 // Column 4
    //                 const avatar = { topText: employeeData[i].name, bottomText: employeeData[i].played_by, picture: employeeData[i].profile_picture };
    //                 row.push(avatar)

    //                 // Column 5
    //                 row.push((employeeData[i].dob === "" || employeeData[i].dob === null) ? 'N/A' : moment(employeeData[i].dob).format("YYYY-MM-DD"));

    //                 // Column 6
    //                 if (employeeData[i].status === "Support") {
    //                         row.push({ class: "badge badge-info text-capitalize", data: "Support" });
    //                 }
    //                 else if (employeeData[i].status === "Main") {
    //                         row.push({ class: "badge badge-success text-capitalize", data: "Main" });
    //                 }
    //                 else if (employeeData[i].status === "Villain") {
    //                         row.push({ class: "badge badge-danger text-capitalize", data: "Villain" });
    //                 }
    //                 _data.push(row);
    //         }




    return (
        <div>
            {/* <OfflineTable
                headerFields={[]} /> */}
        </div >
    )

}