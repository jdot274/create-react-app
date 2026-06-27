import { useEffect, useRef, useState } from 'react';

const BLUE = '#1877F2';
const BG = '#F0F2F5';
const CARD = '#fff';
const GT = '#1d2129';
const GS = '#65676B';
const TR = '#E4E6EB';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFrame(ctx, t) {
  const prog = Math.min(100, Math.floor(t * 120)) % 101;
  const cx = 240;

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, 480, 480);

  // Card shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.10)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = CARD;
  roundRect(ctx, 40, 140, 400, 200, 16);
  ctx.fill();
  ctx.restore();

  // File icon background circle
  ctx.fillStyle = TR;
  ctx.beginPath();
  ctx.arc(cx, 190, 34, 0, Math.PI * 2);
  ctx.fill();

  // File icon
  ctx.strokeStyle = GS;
  ctx.lineWidth = 2;
  ctx.fillStyle = '#fff';
  roundRect(ctx, cx - 12, 172, 24, 30, 3);
  ctx.fill();
  ctx.stroke();

  // File lines
  ctx.strokeStyle = GS;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 7, 181 + i * 6);
    ctx.lineTo(cx + 7, 181 + i * 6);
    ctx.stroke();
  }

  // File corner fold
  ctx.fillStyle = TR;
  ctx.beginPath();
  ctx.moveTo(cx + 4, 172);
  ctx.lineTo(cx + 12, 180);
  ctx.lineTo(cx + 4, 180);
  ctx.closePath();
  ctx.fill();

  // Title
  ctx.textAlign = 'center';
  ctx.fillStyle = GT;
  ctx.font = '600 18px -apple-system, system-ui, sans-serif';
  ctx.fillText('Message History', cx, 248);

  // Filename
  ctx.fillStyle = GS;
  ctx.font = '13px -apple-system, system-ui, sans-serif';
  ctx.fillText('conversation_export_03032024.zip', cx, 268);

  // Progress bar track
  ctx.fillStyle = TR;
  roundRect(ctx, 80, 295, 320, 8, 4);
  ctx.fill();

  // Progress bar fill
  if (prog > 0) {
    ctx.fillStyle = BLUE;
    roundRect(ctx, 80, 295, Math.max(8, 320 * prog / 100), 8, 4);
    ctx.fill();
  }

  // Spinner
  const a = t * 5;
  ctx.strokeStyle = TR;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx - 96, 326, 9, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = BLUE;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx - 96, 326, 9, a, a + 4.5);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Loading text
  ctx.fillStyle = GS;
  ctx.font = '13px -apple-system, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Loading file… ${prog}%`, cx - 82, 330);
}

export default function App() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const t0Ref = useRef(performance.now());
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function loop(now) {
      drawFrame(ctx, (now - t0Ref.current) / 1000);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function handleRecord() {
    const canvas = canvasRef.current;
    setRecording(true);
    const stream = canvas.captureStream(30);
    const chunks = [];
    const mr = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mr.ondataavailable = e => chunks.push(e.data);
    mr.onstop = () => {
      const url = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'message-history-loading.webm';
      a.click();
      setRecording(false);
    };
    mr.start();
    setTimeout(() => mr.stop(), 3000);
  }

  return (
    <div style={styles.page}>
      <canvas ref={canvasRef} width={480} height={480} style={styles.canvas} />
      <button onClick={handleRecord} disabled={recording} style={styles.button}>
        {recording ? 'Recording…' : 'Record 3s → download'}
      </button>
      <p style={styles.hint}>Plays on loop · click record to save a .webm for IG</p>
    </div>
  );
}

const styles = {
  page: {
    margin: 0,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    background: '#0a0a0a',
    fontFamily: 'system-ui',
    padding: 24,
    boxSizing: 'border-box',
  },
  canvas: {
    borderRadius: 12,
  },
  button: {
    background: BLUE,
    color: '#fff',
    border: 0,
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  hint: {
    color: '#888',
    fontSize: 13,
    margin: 0,
  },
};
