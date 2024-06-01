# Jobi CLI Tool

Jobi is a Command Line Interface (CLI) tool designed to help you manage your job applications efficiently. 
With this tool, you can add, update, delete, and view all job applications stored in a MongoDB database.

## Features
- Add Job: Add a new job application to your MongoDB database.
- Update Job: Update details of an existing job application.
- Delete Job: Remove a job application from the database.
- View Jobs: Display all job applications you have applied to.

## Installation

1. Clone the repo
```bash
git clone https://github.com/notkoyo/jobi-cli.git
cd jobi-cli
```
2. Install required dependencies
```bash
npm install
```
3. Change process.env.MONGODB_URI to a string of your own MongoDB URI
```js
await mongoose.connect(
    "mongodb+srv://<username>:<password>@jobi-cli.h91g0jt.mongodb.net/<dbName>?retryWrites=true&w=majority&appName=<clusterName>"
  );
```
4. Install the tool globally
```bash
sudo npm install -g
```
## Usage
- Run the tool in the command line
```bash
jobi
```

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Contact
For any questions or feedback, please open an issue on GitHub or contact me at kaiden@outlook.kr.
