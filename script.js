// Tập hợp love được chạm
const loveTaps = new Set();
let userName = '';

function startApp() {
  const stageIds = ['cardStage', 'startStage', 'inputStage', 'loveStage'];
  const stages = Object.fromEntries(stageIds.map(id => [id, document.getElementById(id)]));

  if (Object.values(stages).some(stage => !stage)) {
    console.error('Falta uno de los elementos del escenario!');
    return;
  }

  stages.startStage.style.display = 'none';
  stages.inputStage.style.display = 'block';
  stages.loveStage.style.display = 'none';
  stages.cardStage.style.display = 'none';

  document.getElementById('bgMusic')?.play().catch(err =>
    console.warn('No puedo reproducir música:', err)
  );

  inipesan();
}

// Hiệu ứng gõ chữ
typeWriterEffect = (text, elementId, callback) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemento con ID no encontrado: ${elementId}`);
    return;
  }

  let i = 0;
  const speed = 50;
  element.textContent = '';

  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      console.log('Efecto de escritura completo');
      callback?.();
    }
  };

  type();
};

function switchStage(fromId, toId, withFade = false) {
  const fromElement = document.getElementById(fromId);
  const toElement = document.getElementById(toId);

  if (!fromElement || !toElement) {
    console.error(`Extraviado element: ${fromId} hoặc ${toId}`);
    return;
  }

  if (withFade) {
    fromElement.classList.add('hidden');
    setTimeout(() => {
      fromElement.style.display = 'none';
      toElement.style.display = 'block';
    }, 1000);
  } else {
    fromElement.style.display = 'none';
    toElement.style.display = 'block';
  }
}

function tapLove(id) {
  if (loveTaps.has(id)) return;

  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id})`);
  loveIcon.classList.add('tapped');
  loveTaps.add(id);
  console.log(`Chạm love ${id}, tổng: ${loveTaps.size}`);

  if (loveTaps.size === 4) {
    Swal.fire({
      title: 'Ejemplo de Vic_Persi!',
      text: '¿Listo para recibir regalos? 💖',
      timer: 1500,
      showConfirmButton: false,
      background: '#fffbe7',
      customClass: { title: 'swal-title', content: 'swal-text' }
    }).then(() => {
      switchStage('loveStage', 'cardStage', true);

      const loveMsg = document.getElementById('loveMsg');
      if (!loveMsg) return console.error('Sin tiempo para nada element loveMsg!');

      typeWriterEffect(
        `buena suerte ${userName} Tu 1/6 es tan feliz como una niño, pero te quiero como un rey 👑. No importa donde estes sonrrie, sueña,aprende,cada dia es un regalo, todos los días!. de parte de su amigo programador y diseñador VIC_PERSI💘`, 'loveMsg',
        () => {
          const fromTag = document.createElement("div");
          fromTag.id = 'fromTag';
          fromTag.textContent = "From: Vic_Persi";
          fromTag.style.marginTop = "20px";
          fromTag.style.opacity = "0";
          fromTag.style.transition = "opacity 1s ease";
          loveMsg.appendChild(fromTag);

          setTimeout(() => {
            fromTag.style.opacity = "1";
          }, 500);
        }
      );
    });
  }
}

async function inipesan() {
  const { value: typedName } = await Swal.fire({
    title: 'Ingrese el nombre del bebé Iuu',
    input: 'text',
    inputValue: '',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: true,
    didOpen: () => Swal.getInput()?.focus(),
    preConfirm: () => Swal.getInput()?.value?.trim()
  });

  if (typedName) {
    userName = typedName;
    loveTaps.clear();
    document.querySelectorAll('.love-icon').forEach(icon =>
      icon.classList.remove('tapped')
    );
    switchStage('inputStage', 'loveStage');
  } else {
    await Swal.fire({
      icon: 'warning',
      title: 'el campo no puede estar en blanco!',
      confirmButtonText: 'VICPERSI'
    });
    inipesan();
  }
}
