#!/usr/bin/env node

import mongoose from "mongoose";
import { input } from "@inquirer/prompts";
import select, { Separator } from "@inquirer/select";
import { config } from "dotenv";
config();

console.log(`
    (_)           _         _    
    | |    ___   | |__     (_)   
   _/ |   / _ \\  | '_ \\    | |   
  |__/_   \\___/  |_.__/   _|_|_  
_|"""""|_|"""""|_|"""""|_|"""""| 
"\`-0-0-'"\`-0-0-'"\`-0-0-'"\`-0-0-'              
`);

const CLI = async () => {
  console.log("Awaiting connection to the database...");
  await mongoose.connect(
    process.env.MONGODB_URI
  );
  console.log("Connected to the database successfully.\n");

  const JobSchema = new mongoose.Schema({
    position: { type: String, required: true },
    company: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: String, required: true },
  });

  const JobModel = mongoose.model("Job", JobSchema);
  const getJobs = async () => JobModel.find();

  const tasks = await select({
    message: "What would you like to do?",
    choices: [
      new Separator(),
      {
        name: "add job",
        value: "create",
        description: "create a new job application entry",
      },
      {
        name: "update job",
        value: "update",
        description: "update an existing job application entry",
      },
      {
        name: "view jobs",
        value: "view",
        description: "view all current jobs applied to",
      },
      new Separator(),
      {
        name: "delete job",
        value: "delete",
        description: "delete a job from the list",
      },
      new Separator(),
    ],
  });

  if (tasks === "create") {
    const answers = {
      position: await input({
        message: "position",
      }),
      company: await input({
        message: "company",
      }),
      status: await input({
        message: "status",
      }),
      date: await input({
        message: "date",
      }),
    };

    const createJob = (values) => new JobModel(values).save();

    await createJob(answers);
    console.log(
      `\nCreated Job Entry for ${answers.position} @ ${answers.company}, applied on ${answers.date}.\n`
    );
    process.exit(0);
  } else if (tasks === "view") {
    const jobs = await getJobs();
    console.log(`\n`);

    jobs.forEach((job) => {
      console.log(
        `${job.position} @ ${job.company} - ${job.status} on ${job.date}`
      );
    });

    process.exit(0);
  } else if (tasks === "update") {
    const jobs = await getJobs();
    const jobOptions = jobs.map((job) => {
      const jobObj = {
        name: `${job.position} @ ${job.company}`,
        value: job._id,
      };
      return jobObj;
    });

    const updateableJobsId = await select({
      message: "Which job would you like to update?",
      choices: [new Separator(), ...jobOptions, new Separator()],
    });

    const propertyToUpdate = await select({
      message: "Which property would you like to delete?",
      choices: [
        new Separator(),
        {
          name: "position",
          value: "position",
        },
        new Separator(),
        {
          name: "company",
          value: "company",
        },
        new Separator(),
        {
          name: "status",
          value: "status",
        },
        new Separator(),
        {
          name: "date",
          value: "date",
        },
        new Separator(),
      ],
    });

    const propertyToUpdateValue = await input({
      message: propertyToUpdate,
    });

    const newValues = {
      propertyToUpdate,
    };

    newValues[propertyToUpdate] = propertyToUpdateValue;

    const updatedJob = await JobModel.findByIdAndUpdate(
      updateableJobsId,
      newValues
    );

    console.log(
      `Job updated: ${updatedJob.position} @ ${updatedJob.company}\nProperty Updated: ${propertyToUpdate}\nOld Value: ${updatedJob[propertyToUpdate]}\nNew Value: ${propertyToUpdateValue}`
    );

    process.exit(0);
  } else if (tasks === "delete") {
    const jobs = await getJobs();
    const jobOptions = jobs.map((job) => {
      const jobObj = {
        name: `${job.position} @ ${job.company}`,
        value: job._id,
      };
      return jobObj;
    });

    const deleteableJobsId = await select({
      message: "Which job would you like to update?",
      choices: [new Separator(), ...jobOptions, new Separator()],
    });

    const deletedJob = await JobModel.findByIdAndDelete(deleteableJobsId);

    console.log(`\nDeleted Job: ${deletedJob.position} @ ${deletedJob.company}`);
    process.exit(0);
  }
};

CLI();
