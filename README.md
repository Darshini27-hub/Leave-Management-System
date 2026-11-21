# Leave Management System

A MERN stack app where employees apply for leave, managers approve or reject it, and the admin manages users, leave types and holidays.

## Live Links
- Frontend: https://leave-management-system-psi-nine.vercel.app
- Backend: https://leave-management-system-7lhu.onrender.com

## Tech Stack
React (Vite), Tailwind CSS, Axios, Node.js, Express, MongoDB Atlas, Mongoose, JWT

## Features
- Login, change password, role-based access (employee, manager, admin)
- Admin manages users, leave types and holidays
- Employees and managers apply for leave, filter history and cancel
- Managers approve or reject team requests (comment required on rejection)
- Leave days skip weekends and holidays, balance reduces on approval
- Dashboards for all roles, responsive green UI

## Sample Logins
- Admin: admin@company.com / admin123
- Manager: priya@company.com / manager123, suresh@company.com / manager123
- Employee: ravi@company.com / employee123, anitha@company.com / employee123, divya@company.com / employee123

## Assumptions
- A leave must be within one calendar year.
- Validation is done inside each controller.
- Changing a leave type's yearly days does not change existing balances.

## Deployment
Database on MongoDB Atlas, backend on Render, frontend on Vercel.
