const key = "";

const audioPlayer = document.getElementById("audioPlayer");

let hintIcon = document.getElementById("hintIcon");

let roleSet = document.getElementById("roleSet");

let sendProblem = document.getElementById("sendProblem");

let lock = document.getElementById("lock");

let inputSystemMsg = document.getElementById("inputSystemMsg");

//回傳放置的element
let returnMsg = document.getElementById("returnMsg");

let inputUserMsg = document.getElementById("inputUserMsg");

let hint = document.createElement("div");

//role:system的content
let systemMsg;

hint.classList.add(
  "z-10",
  "bg-white/90",
  "absolute",
  "w-[25rem]",
  "flex",
  "top-[5rem]",
  "left-[0]",
  "rounded-lg",
  "text-black",
  "p-6",
  "text-base",
  "font-normal",
  "text-justify"
);

hint.innerHTML = ` <div class="flex-[1] font-bold">提示詞</div>
  <div class="flex-[3]">
    您是{task2}的專家顧問，個性{task1}。 20
    年來。您一直在幫助人們完成{task2}。
    你現在的任務是在{task2}時給出最好的解決方案。
    回答不超過50字。{task1} = "細心、溫柔" {task2} = "Aiot製作"。
  </div>`;

hintIcon.addEventListener("mouseover", () => {
  // console.log("mouseover");
  hint.classList.remove("hidden");
  roleSet.appendChild(hint);
});

hintIcon.addEventListener("mouseout", () => {
  // console.log("mouseout");
  hint.classList.add("hidden");
  roleSet.appendChild(hint);
});

lock.addEventListener("click", async (e) => {
  systemMsg = inputSystemMsg.value;
  console.log(systemMsg);
  lock.innerHTML = ` 
  <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="w-6 h-6"
>
  <path
    fill-rule="evenodd"
    d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
    clip-rule="evenodd"
  />
</svg>`;
  lock.classList.add("bg-lime-600");
  inputSystemMsg.disabled = true;
  inputSystemMsg.style.backgroundColor = "rgb(156, 163, 175)";
});

sendProblem.addEventListener("click", () => {
  console.log(inputUserMsg.value);
  sendText(inputUserMsg.value);
});

//傳送文字敘述
async function sendText(userMessage) {
  let msg = {
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content: `${systemMsg}回答不超過50字。`,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    max_tokens: 500,
  };

  let resOpenai = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    method: "POST",
    body: JSON.stringify(msg),
  });
  let openaiMsg = await resOpenai.json();
  console.log(openaiMsg);
  console.log(openaiMsg.choices[0].message.content);
  returnMsg.classList.add("p-5");
  returnMsg.innerText = openaiMsg.choices[0].message.content;
  getVoice(openaiMsg.choices[0].message.content);
}

//獲取語音，參數input為要輸出的聲音
async function getVoice(input) {
  let msg = {
    model: "tts-1",
    input,
    voice: "nova",
  };

  let resOpenai = await fetch("https://api.openai.com/v1/audio/speech", {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    method: "POST",
    body: JSON.stringify(msg),
  });

  if (resOpenai.ok) {
    const audioBlob = await resOpenai.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    // 可以使用這個 audioUrl 來播放音頻
    audioPlayer.src = audioUrl; // 設置音頻源
    audioPlayer.play(); // 自動播放音頻
  } else {
    console.error("Error fetching audio: ", resOpenai.status);
  }
}
