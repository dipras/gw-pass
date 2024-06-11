const Modal = ({ open, setOpen, renderContent, title, onSave }) => {
    return (
        <div className={`${open ? "absolute" : "hidden"} bg-[rgba(0,0,0,0.5)] w-full h-full top-0 px-2 py-24`}>
            <div className="max-w-screen-lg mx-auto">
                <div className="bg-white dark:bg-gray-700 p-5 divide-y divide-gray-500 rounded-lg">
                    <h1 className="text-gray-900 dark:text-white text-xl py-2">{title || "Modal Title"}</h1>
                    <div className="text-gray-900 dark:text-white py-10">
                        {renderContent ? renderContent() : "Body"}
                    </div>
                    <div className="flex flex-row justify-end pt-2">
                        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={onSave}>Save</button>
                        <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => setOpen(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;