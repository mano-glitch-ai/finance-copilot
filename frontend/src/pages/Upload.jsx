import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

import {
    FaCloudUploadAlt,
    FaFileCsv,
    FaFilePdf,
    FaImage,
    FaUpload,
    FaCheckCircle,
    FaTrash,
    FaSyncAlt,
    FaFileAlt,
} from "react-icons/fa";

export default function Upload() {

    const inputRef = useRef(null);
    const replaceInputRef = useRef(null);

    const [file, setFile] = useState(null);

    const [documents, setDocuments] = useState([]);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [replaceId, setReplaceId] = useState(null);

    const [deleteId, setDeleteId] = useState(null);



    useEffect(() => {

        loadDocuments();

    }, []);



    async function loadDocuments() {

        try {

            const response = await api.get("/documents");

            setDocuments(response.data);

        }

        catch (err) {

            console.log(err);

        }

    }



    function handleSelect(e) {

        if (e.target.files.length > 0) {

            setFile(e.target.files[0]);

            setResult(null);

        }

    }



    async function uploadFile() {

        if (!file) return;

        setLoading(true);

        const formData = new FormData();

        formData.append("file", file);

        try {

            const response = await api.post(

                "/documents/upload",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data",

                    },

                }

            );

            setResult(response.data);

            setFile(null);

            loadDocuments();

        }

        catch (err) {

            console.log(err);

            alert("Upload failed.");

        }

        finally {

            setLoading(false);

        }

    }



    async function deleteDocument(id) {

        if (!window.confirm(

            "Delete this document?\n\nAll imported transactions will also be deleted."

        )) return;

        try {

            await api.delete(`/documents/${id}`);

            loadDocuments();

            setResult(null);

        }

        catch (err) {

            console.log(err);

            alert("Unable to delete document.");

        }

    }



    function chooseReplacement(id) {

        setReplaceId(id);

        replaceInputRef.current.click();

    }



    async function replaceDocument(e) {

        if (!replaceId) return;

        if (e.target.files.length === 0) return;

        const formData = new FormData();

        formData.append(

            "file",

            e.target.files[0]

        );

        try {

            await api.put(

                `/documents/${replaceId}/replace`,

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data",

                    },

                }

            );

            setReplaceId(null);

            loadDocuments();

        }

        catch (err) {

            console.log(err);

            alert("Replacement failed.");

        }

    }



    function formatDate(date) {

        return new Date(date).toLocaleString();

    } return (

        <Layout>

            <h1 className="text-5xl font-bold text-white mb-3">
                Document Manager
            </h1>

            <p className="text-slate-400 mb-10">
                Upload, manage, replace or delete your financial statements.
                Your dashboard updates automatically whenever documents change.
            </p>

            <input
                ref={replaceInputRef}
                type="file"
                accept=".csv,.pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={replaceDocument}
            />

            <div className="max-w-6xl mx-auto">

                {/* Upload Card */}

                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-10">

                    <div

                        onClick={() => inputRef.current.click()}

                        className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-blue-500 transition rounded-3xl p-14 text-center"

                    >

                        <FaCloudUploadAlt className="mx-auto text-6xl text-blue-500 mb-6" />

                        <h2 className="text-3xl font-bold text-white">
                            Upload New Statement
                        </h2>

                        <p className="text-slate-400 mt-3">
                            CSV • PDF • Images
                        </p>

                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept=".csv,.pdf,.png,.jpg,.jpeg"
                            onChange={handleSelect}
                        />

                    </div>

                    {file && (

                        <div className="mt-8 bg-slate-800 rounded-2xl p-6 flex justify-between items-center">

                            <div>

                                <p className="text-blue-400 font-semibold">
                                    {file.name}
                                </p>

                                <p className="text-slate-400 text-sm">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>

                            </div>

                            <button

                                onClick={uploadFile}

                                disabled={loading}

                                className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-xl flex items-center gap-3"

                            >

                                <FaUpload />

                                {loading ? "Uploading..." : "Upload"}

                            </button>

                        </div>

                    )}

                    {result && (

                        <div className="mt-8 rounded-2xl border border-green-500 bg-green-900/20 p-6">

                            <div className="flex gap-4 items-center">

                                <FaCheckCircle className="text-green-400 text-4xl" />

                                <div>

                                    <h3 className="text-white text-2xl font-bold">

                                        Upload Successful

                                    </h3>

                                    <p className="text-green-300">

                                        {result.transactions_imported} transactions imported successfully.

                                    </p>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* Uploaded Documents */}

                <div className="mt-12">

                    <h2 className="text-3xl font-bold text-white mb-6">

                        Uploaded Documents

                    </h2>

                    {

                        documents.length === 0 ?

                            (

                                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center">

                                    <FaFileAlt className="mx-auto text-6xl text-slate-600 mb-5" />

                                    <h3 className="text-2xl text-white font-bold">

                                        No Documents Uploaded

                                    </h3>

                                    <p className="text-slate-400 mt-2">

                                        Upload your first financial statement to begin analysing your spending.

                                    </p>

                                </div>

                            )

                            :

                            (

                                <div className="space-y-5">

                                    {

                                        documents.map((doc) => (

                                            <div

                                                key={doc.id}

                                                className="bg-slate-900 border border-slate-800 rounded-3xl p-7 flex justify-between items-center"

                                            >

                                                <div>

                                                    <div className="flex items-center gap-3">

                                                        <FaFilePdf className="text-red-400 text-2xl" />

                                                        <h3 className="text-white text-xl font-semibold">

                                                            {doc.file_name}

                                                        </h3>

                                                    </div>

                                                    <p className="text-slate-400 mt-2">

                                                        Uploaded: {formatDate(doc.uploaded_at)}

                                                    </p>

                                                    <p className="text-slate-400">

                                                        Transactions: {doc.transactions}

                                                    </p>

                                                    <p className="text-green-400 mt-1">

                                                        {doc.status}

                                                    </p>

                                                </div>

                                                <div className="flex gap-4">

                                                    <button

                                                        onClick={() => chooseReplacement(doc.id)}

                                                        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2"

                                                    >

                                                        <FaSyncAlt />

                                                        Replace

                                                    </button>

                                                    <button

                                                        onClick={() => deleteDocument(doc.id)}

                                                        className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl flex items-center gap-2"

                                                    >

                                                        <FaTrash />

                                                        Delete

                                                    </button>

                                                </div>

                                            </div>

                                        ))

                                    }

                                </div>

                            )

                    }

                </div>

            </div>

        </Layout>

    );
}