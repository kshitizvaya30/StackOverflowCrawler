const CHEERIO = require('cheerio');
const REQUEST = require('request-promise');
const JSONFRAME = require('jsonframe-cheerio');
const FS = require('fs');
const { mongoDBConnection } = require('./../db/db-handler.js');
const QuestionsService = require('./QuestionsService.js');
const Question = require('./../models/Questions.js')
const BASE_URL = 'https://stackoverflow.com/questions?page=';
const URL_ORDERING = '&sort=votes';
const LAST_PAGE_TO_SCRAPE = 10;
const QUANTITY_OF_PAGES_PER_WORKER = 1;


const formatTables = async () => {
    const mongooseClient = await mongoDBConnection();
    // await Question.deleteMany({});
}

const fetchData = async() => {

    await formatTables();

    let workerStartingPoint = parseInt(process.env.startingPoint);
    for (let i = workerStartingPoint; i < workerStartingPoint + QUANTITY_OF_PAGES_PER_WORKER; i++) {
        const d = await REQUEST(BASE_URL + i + URL_ORDERING);

        // REQUEST(BASE_URL + i + URL_ORDERING, function (error, response, html) {
            if (d.error) {
                process.exit(workerStartingPoint);//error code is where the worker should start again
            }

            let $ = CHEERIO.load(d);
            JSONFRAME($);
            let frame = {
                questions: {
                    _s: "#questions .question-summary",
                    _d: [{
                        "votes": ".statscontainer .stats .vote .votes .vote-count-post strong",
                        "answers": ".statscontainer .stats .status strong",
                        "views": ".statscontainer .views",
                        "url": ".question-hyperlink @ href"
                    }]
                }
            }
            let questions = $('body').scrape(frame, { string: true });
            const allQuestions = JSON.parse(questions);
            const filteredQuestions = allQuestions.questions;

            for(var l = 0; l < filteredQuestions.length; l++) {
                await QuestionsService.create(filteredQuestions[l]);
            }

            FS.writeFile('temp/page-' + i + '.json', questions, function (error) {
                if (error) {
                    process.exit(workerStartingPoint);
                }
                process.exit(0);
            })
        // });
    }
}

module.exports = {
    fetchData
}