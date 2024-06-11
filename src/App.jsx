import { useCallback, useState } from "react";
import IconArrowRight from "./icons/IconArrowRight";
import CryptoJS from "crypto-js";
import Modal from "./Modal";
import IconCopy from "./icons/IconCopy";

const templateData = {
  created_at: new Date(),
  updated_at: new Date(),
  passwords: []
};

function App() {
  const [chiper, setChiper] = useState("");
  const [passKey, setPassKey] = useState("");
  const [data, setData] = useState(null);
  const [modal, setModal] = useState(false);
  const [fillData, setFillData] = useState({
    title: "",
    username: "",
    password: ""
  });
  const [selectedData, setSelectedData] = useState(null);

  const createEncrypted = (data = templateData) => {
    if (passKey == "") {
      alert("Please fill the master password first");
      return;
    }

    const md5 = CryptoJS.MD5(passKey).toString();

    var key = CryptoJS.enc.Utf8.parse(md5.slice(0, 16));
    let iv = CryptoJS.enc.Utf8.parse(md5.slice(16, 32));

    // Encrypt the plaintext
    var cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    setChiper(cipherText.toString());
    setData(data)
  }

  const openEncrypted = () => {
    if (passKey == "" || chiper == "") {
      alert("Please fill the master password and encrypted text first");
      return;
    }

    const md5 = CryptoJS.MD5(passKey).toString();
    let iv1 = CryptoJS.enc.Utf8.parse(md5.slice(16, 32));

    var key = CryptoJS.enc.Utf8.parse(md5.slice(0, 16));
    var cipherBytes = CryptoJS.enc.Base64.parse(chiper);

    try {
      var decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherBytes }, key, {
        iv: iv1,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      const data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

      setData(data);
    } catch (error) {
      alert("wrong pass")
    }
  }

  const saveData = () => {
    const newData = {
      title: fillData.title,
      username: fillData.username,
      password: fillData.password,
    };
    let passwords = [...data.passwords];
    if(selectedData || selectedData === 0) {
      passwords[selectedData] = newData;
    } else {
      passwords.push(newData)
    }
    createEncrypted({
      ...data,
      passwords: passwords
    })
    
    setModal(false);
  };

  const renderModalBody = () => {
    return (
      <>
        <div className="py-2 flex flex-row">
          <div className="grow">
            <label htmlFor="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
            <input type="text" id="title" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Title" value={fillData.title} onChange={e => setFillData(prevState => ({...prevState, title: e.target.value}))} />
          </div>
          <IconCopy className="cursor-pointer" onClick={() => navigator.clipboard.writeText(fillData.title)} />
        </div>
        <div className="py-2 flex flex-row">
          <div className="grow">
            <label htmlFor="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <input type="text" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" value={fillData.username} onChange={e => setFillData(prevState => ({...prevState, username: e.target.value}))} />
          </div>
          <IconCopy className="cursor-pointer" onClick={() => navigator.clipboard.writeText(fillData.username)} />
        </div>
        <div className="py-2 flex flex-row">
          <div className="grow">
            <label htmlFor="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input type="text" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" value={fillData.password} onChange={e => setFillData(prevState => ({...prevState, password: e.target.value}))} />
          </div>
          <IconCopy className="cursor-pointer" onClick={() => navigator.clipboard.writeText(fillData.password)} />
        </div>
      </>
    )
  }

  const editData = i => {
    setSelectedData(i);
    setFillData({
      title: data.passwords[i].title,
      username: data.passwords[i].username,
      password: data.passwords[i].password,
    });

    setModal(true);
  }

  return (
    <>
      <div className="max-w-screen-lg mx-auto p-3">
        <h1 className="text-2xl text-center font-semibold mb-5 text-black text-gray-900  dark:text-white">GNU Weebs Password Manager</h1>

        <div className="w-full bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex flex-row gap-3">
          <p className="text-gray-900 dark:text-white text-lg">Home</p>
          <p className="text-gray-900 dark:text-white text-lg">About</p>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          <div>
            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">encrypted Text</label>
            <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your hash text" value={chiper} onChange={e => setChiper(e.target.value)}></textarea>
            <p id="helper-text-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">If you don't have encrypted data yet, don't fill this form. Fill master password and click "Create New Encrypted"</p>
          </div>
          <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Master Password</label>
            <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pass Key" value={passKey} onChange={e => setPassKey(e.target.value)} />
            <div className="flex flex-row mt-2 justify-end">
              <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={openEncrypted}>Open Password</button>
              {chiper == "" && (
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => createEncrypted()}>Create New Encrypted</button>
              )}
            </div>
          </div>
        </div>

        {data && (
          <div className="w-100 bg-gray-700 p-2 mt-10">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2">
                <p className="text-white text-xl">List Password</p>
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => {
                  setModal(true);
                  setSelectedData(null);
                  setFillData({
                    title: "",
                    username: "",
                    password: ""
                  })
                }}>+</button>
              </div>
              <div>
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Password" required />
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-500" style={{ height: 400, overflowY: "scroll" }}>
              {data.passwords.map((v, i) => (
                <div className="p-2 flex flex-row justify-between cursor-pointer hover:bg-gray-800" key={i} onClick={() => editData(i)}>
                  <p className="text-white">{v.title}</p>
                  <IconArrowRight className="text-white" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Modal open={modal} setOpen={setModal} renderContent={renderModalBody} title={"Add Password"} onSave={saveData} />
    </>
  );
}

export default App;
