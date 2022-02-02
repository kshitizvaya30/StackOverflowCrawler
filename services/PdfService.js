const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const QuestionsService = require("./QuestionsService.js");
const Question = require("./../models/Questions.js");

// create document
let doc = new PDFDocument({ margin: 30, size: "A4" });

doc.pipe(fs.createWriteStream("StakcOverlfowQuestionAnalysis.pdf"));

const questionsDataPdf = async () => {
  try {
    const data = await Question.find({}, { _id: 0, __v: 0 });
    return data;
  } catch (e) {
    return null;
  }
};

module.exports = {
  questionsDataPdf,
};
