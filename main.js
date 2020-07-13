const notes = document.getElementById("notes");
const wrapper = document.getElementById("wrapper");
let editorActive = false;

document.addEventListener("keyup", (e) => {
  if (editorActive && e.key === "Escape") {
    removeEditor(editorActive);
  }
});

notes.addEventListener("click", (e) => {
  let x = ((e.pageX + wrapper.scrollLeft) / notes.offsetWidth) * 100;
  let y = ((e.pageY + wrapper.scrollTop) / notes.offsetHeight) * 100;
  if (!editorActive) {
    createEditor(x, y, 12, 12, {
      red: Math.round(150 + Math.random() * 75),
      green: Math.round(150 + Math.random() * 75),
      blue: Math.round(150 + Math.random() * 75),
    });
  }
});

const createNote = (x, y, width, height, t, c, color) => {
  let note = document.createElement("div");
  note.classList.add("note");
  note.style.left = `calc(${x}% - ${width / 2}em)`;
  note.style.top = `calc(${y}% - ${height / 2}em)`;
  note.style.width = `${width}em`;
  note.style.height = `${height}em`;

  let title = document.createElement("h1");
  title.innerHTML = t;
  title.style.background = `rgb(${color.red + 20},${color.green + 20}, ${
    color.blue + 20
  })`;
  let content = document.createElement("p");
  content.style.background = `rgb(${color.red},${color.green}, ${color.blue})`;
  content.innerHTML = c;

  note.appendChild(title);
  note.appendChild(content);

  notes.appendChild(note);
};

const createEditor = (x, y, width, height, color) => {
  let editor = document.createElement("div");
  editorActive = editor;
  editor.classList.add("editor");
  editor.style.left = `calc(${x}% - ${width / 2}em)`;
  editor.style.top = `calc(${y}% - ${height / 2}em)`;
  editor.style.width = `${width}em`;
  editor.style.height = `${height}em`;
  let i = document.createElement("input");
  i.type = "text";
  i.maxLength = 10;
  i.spellcheck = false;
  i.style.background = `rgb(${color.red + 20},${color.green + 20}, ${
    color.blue + 20
  })`;
  let t = document.createElement("textarea");
  t.maxLength = 42;
  t.spellcheck = false;
  t.style.background = `rgb(${color.red},${color.green}, ${color.blue})`;
  i.addEventListener("keyup", (e) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (e.key === "Enter") {
      t.focus();
    }
  });
  t.addEventListener("keyup", (e) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (e.key === "Enter") {
      t.value = t.value.replace(/(\r\n|\n|\r)/gm, "");
      handleNoteCreation(
        editor,
        x,
        y,
        width,
        height,
        i.value == "" ? "" : i.value,
        t.value,
        color
      );
    }
  });
  let confirm = document.createElement("button");
  let cancel = document.createElement("button");
  confirm.classList.add("confirm");
  cancel.classList.add("cancel");
  confirm.innerHTML = "&#10003";
  cancel.innerHTML = "x";
  editor.appendChild(i);
  editor.appendChild(t);
  editor.appendChild(confirm);
  editor.appendChild(cancel);

  confirm.addEventListener("click", () => {
    handleNoteCreation(
      editor,
      x,
      y,
      width,
      height,
      i.value == "" ? "" : i.value,
      t.value,
      color
    );
  });
  cancel.addEventListener("click", () => {
    removeEditor(editor);
  });

  // editor.addEventListener("keyup", (e) => {
  //   if (e.key === "Escape") {
  //     removeEditor(editor);
  //   }
  // });

  notes.appendChild(editor);
  i.focus();
};

const removeEditor = (editor) => {
  const p = new Promise((resolve) => {
    notes.removeChild(editor);
    setTimeout(() => {
      resolve();
    }, 200); //Avoid accidental editor creation immediately after closing out
  });
  p.then(() => {
    editorActive = false;
  });
};

const handleNoteCreation = (
  editor,
  x,
  y,
  width,
  height,
  title,
  content,
  color
) => {
  createNote(x, y, width, height, title, content, color);
  sendNote({
    x: x,
    y: y,
    width: width,
    height: height,
    title: title,
    content: content,
    color: color,
  });
  removeEditor(editor);
};

async function getNotes() {
  let res = await fetch("./get-notes");
  let body = await res.json();
  body.data.forEach((note) => {
    data = note.data;
    createNote(
      data.x,
      data.y,
      data.width,
      data.height,
      data.title,
      data.content,
      data.color
    );
  });
}

async function sendNote(data) {
  const res = await fetch("./.netlify/functions/send-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

getNotes();
