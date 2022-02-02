const CLUSTER = require("cluster");
const { mongoDBConnection } = require("./db/db-handler.js");
const { fetchData } = require("./services/FetchData.js");
var mongoose = require("mongoose");
const CORES = 5;
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const LAST_PAGE_TO_SCRAPE = 10;
const QUANTITY_OF_PAGES_PER_WORKER = 1;

const PdfService = require("./services/PdfService.js");

const mongoDB =
  "mongodb+srv://kshitiz:kshitiz@cluster0.prifr.mongodb.net/stackoverflow?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

process.stdin.resume(); //so the program will not close instantly

if (CLUSTER.isMaster) {
  let nextPage = 1;
  for (let i = 0; i < CORES; i++) {
    CLUSTER.fork({ startingPoint: nextPage });
    nextPage += 1;
  }

  CLUSTER.on("online", (worker) => {
    // console.log(`Worker ${worker.process.pid} is now working.`);
  });

  CLUSTER.on("exit", async (worker, code, signal) => {
    if (code !== 0) {
      //restart
      // console.log(`Worker ${worker.process.pid} died. Restarting.`);
      CLUSTER.fork({ startingPoint: worker.process.env.startingPoint });
    } else {
      //scrape next X pages
      console.log(
        `Worker ${worker.process.pid} finished it's work succesfully.`
      );
      if (nextPage <= LAST_PAGE_TO_SCRAPE) {
        CLUSTER.fork({ startingPoint: nextPage });
        nextPage += QUANTITY_OF_PAGES_PER_WORKER;
      }
    }
    const questionsData = await PdfService.questionsDataPdf();
    if (questionsData) {
      doc = new PDFDocument();
      doc.pipe(fs.createWriteStream("output.pdf"));
      // doc.text(questionsData);

      const table = {
        title: "ehlel",
        headers: [
          { label: "URL", property: "url", width: 100, renderer: null },
          { label: "Votes", property: "votes", width: 100, renderer: null },
          { label: "Answers", property: "answers", width: 100, renderer: null },
          { label: "Views", property: "views", width: 100, renderer: null },
          { label: "Count", property: "count", width: 100, renderer: null },
        ],
        datas: questionsData,
      };
      doc.table(table);
      doc.end();
    }
  });
} else {
  fetchData();
}

async function exitHandler(options, exitCode) {
  // const data = await PdfService.questionsDataPdf();
  // console.log("we are cleaning")
  if (options.cleanup) console.log("clean");
  // if (exitCode || exitCode === 0) console.log(exitCode);
  // if (options.exit)
  process.exit(0);
}

// process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
//do something when app is closing
process.on("exit", async () => {
  await PdfService.questionsDataPdf();
  process.exit(0);
});

//catches ctrl+c event
// process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// node --no-warnings index.js
