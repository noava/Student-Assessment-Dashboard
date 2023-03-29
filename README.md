# Student Assessment Dashboard

This is a React Native app that allows you to track the grades of students in various classes. It uses Firebase for data storage and retrieval, and includes functionality for adding, editing, and deleting students. Additionally, the app displays a bar chart showing the distribution of grades across all classes.

## Installation

1.  Clone the repository: `git clone https://github.com/noava/Student-Assessment-Dashboard.git`
2.  Install dependencies: `npm install`
3.  Add your Firebase configuration details to `firebaseConfig.js`
4.  Run the app: `npm start`

## Usage

### Adding a Student

To add a new student to the database, fill out the form on the "Add Student" screen with the student's class ID, first name, last name, date of birth, class name, score, and grade. The app will ensure that all required fields are filled in, and that the grade entered is a valid letter grade (A, B, C, D, E, or F).

### Editing a Student

To edit an existing student, click on the student's name from the main screen, then click the "Edit" button. This will open a modal with a form pre-populated with the student's current information. Make any changes you wish to the student's information, then click "Save" to update the database. To cancel editing without saving changes, click "Cancel".

### Deleting a Student

To delete a student, click on the student's name from the main screen, then click the "Delete" button.

### Viewing Grade Distribution

To view the distribution of grades across all classes, navigate to the "Grade Distribution" part of the screen. A bar chart will be displayed showing the number of students who received each letter grade.

## Contributing

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
