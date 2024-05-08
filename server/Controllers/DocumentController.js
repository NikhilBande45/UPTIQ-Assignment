const DocumentModel = require('../Models/DocumentModel');
const UserModel = require('../Models/UserModel');
const handleGetAllDocuments = async (req, res) => {
    try {
        // const {user}=req;
        console.log("All docs");
        let documents = await DocumentModel.find({}).populate({ path: 'Owner', select: "-Password" });
        return res.json({ status: "OK", documents });
    } catch (error) {

    }
}

const handleNewDocument = async (req, res) => {
    try {
        const { user } = req;
        const { secretKey } = req.body;
        // console.log(req.file.path);
        // console.log(req.body);

        const doc=await DocumentModel.create({
            Owner: user._id,
            secretKey,
            Filepath: req.file.path,
            AccessebleUsers: []
        });
        console.log(doc);
        return res.json({ status: "OK" });

    } catch (error) {
        console.log(error.message);
    }
}
const handleDownloadDocument = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        
      
        const document = await DocumentModel.findById(id);

        console.log(document);
        
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Send the document file for download
        res.download(document.Filepath);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const handleGetDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const docs = await DocumentModel.findById(id).populate({ path: 'Owner', select: "-Password" });
        console.log(docs);
        if (!docs) {
            return res.status(404).json({ status: "Failed", message: "Document not found" });
        }
        if (user._id.toString() !== docs.Owner._id.toString() && docs.AccessebleUsers.includes(user._id))
            return res.json(201).json({ message: "Unauthorised request" });

        res.setHeader('Content-Disposition', `attachment; filename=sample`);
        res.setHeader('Content-Type', 'application/octet-stream');
        const fileStream = fs.createReadStream(docs.Filepath);
        fileStream.pipe(res);

    } catch (error) {

    }
}

const handleGetAllowedUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        console.log(user);
        const docs = await DocumentModel.findById(id).populate({ path: 'Owner', select: "-Password" });
        // console.log(docs);
        if (!docs)
            return res.status(404).json({ message: "Document Not found" });
        if (user._id.toString() !== docs.Owner._id.toString())
            return res.status(201).json({ message: "Unauthorised request" });
        for (let i = 0; i < docs.AccessebleUsers.length; i++) {
            await docs.populate({
                path: `AccessebleUsers.${i}.user`,
                model: 'User',
                select: '-Password'
            });
        }
        return res.json({ AccesibleUsers: docs.AccessebleUsers });

    } catch (error) {
        console.log(error.message);
        return res.status(501);
    }
}

const handleAddAllowedUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const { Email } = req.body;
        let docs = await DocumentModel.findById(id).populate({ path: 'Owner', select: "-Password" });
        // console.log(docs);
        if (!docs)
            return res.status(404).json({ message: "Document Not found" });

        if (user._id.toString() !== docs.Owner._id.toString())
            return res.status(201).json({ message: "Unauthorised request" });

        const AllowedUser = await UserModel.findOne({ Email });
        if (!AllowedUser) {
            return res.status(404).json({ status: "Failed", message: "User not found" });
        }
        if (docs.AccessebleUsers.includes( AllowedUser._id )) {
            return res.json({ message: "User already have access of the document" });
        }
        docs.AccessebleUsers.push( {user:AllowedUser._id});
        await docs.save();

        return res.json({ status: "OK" });
    } catch (error) {
        console.log(error.message);
        return res.status(501);
    }
}

const handleDeleteAllowedUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const { userIdtoDelete } = req.body;
        console.log(userIdtoDelete);
        let docs = await DocumentModel.findById(id).populate({ path: 'Owner', select: "-Password" });
        console.log(docs);
        if (!docs)
            return res.status(404).json({ message: "Document Not found" });

        if (user._id.toString() !== docs.Owner._id.toString())
            return res.json(201).json({ message: "Access denied" });
        // console.log();
        if (docs.AccessebleUsers.findIndex((accessible) => {
            return accessible._id.toString() === userIdtoDelete.toString()
        }) === -1) {
            return res.json({ message: "User does not have the access of the document" });
        }

        docs.AccessebleUsers = docs.AccessebleUsers.filter((user) => {
            return user._id.toString() !== userIdtoDelete.toString();
        });
        // console.log(docs);
        await docs.save();
        return res.json({ status: "OK" });
    } catch (error) {

    }
}
const handleUpdateDocument = async (req, res) => {
    // try {
    //     const { id } = req.params;
    //     const { user } = req;
    //     const { Data } = req.body;
    //     let docs = await DocumentModel.findById(id).populate({ path: 'Owner.user', select: "-Password" });
    //     // console.log(docs);
    //     if (!docs)
    //         return res.status(404).json({ message: "Document Not found" });

    //     if (user._id.toString() !== docs.Owner.user._id.toString())
    //         return res.json(201).json({ message: "Access denied" });
    //     docs.Data = Data;
    //     await docs.save();
    //     return res.json({ status: "OK" });
    // } catch (error) {

    // }
}
module.exports = { handleAddAllowedUser,handleDownloadDocument, handleGetAllowedUsers, handleGetDocument, handleNewDocument, handleGetAllDocuments, handleUpdateDocument, handleDeleteAllowedUser }