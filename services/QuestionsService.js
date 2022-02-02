const questionsModel = require('../models/Questions');

// module.exports.create = async (question) => {
//     if (!question)
//         throw new Error('Missing question');

//     await questionsModel.create(question);
// }

const create = async (question) => {
	if (!question)
        throw new Error('Missing data');

    var obj = await questionsModel.findOne({url: question.url});

    if(obj) {
    	obj.count += 1;
    } else {
    	obj = new questionsModel({
    		...question
    	});
    }

    await obj.save();
}

const listAllData = async () => {
	console.log("Question :: ");

	const a = await questionsModel.find({});
	console.log("a :: ",a)
	return a;
}

module.exports = {
	create,
	listAllData
}