import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QrAccessScanner = ({ onScanSuccess }) => {
  const [scanned, setScanned] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [error, setError] = useState(null);

  const handleResult = (result, error) => {
    if (!!result && !scanned) {
      setScanned(true);
      setQrValue(result.text);
      setError(null);
      if (onScanSuccess) onScanSuccess(result.text);
    }
    if (error) {
      setError('Error al acceder a la cámara o leer el código');
      // Opcional: console.error(error);
    }
  };

  const handleReset = () => {
    setScanned(false);
    setQrValue('');
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 bg-zinc-800 rounded-lg max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-2">Escanea tu código QR</h2>
      {!scanned ? (
        <div style={{ width: 300 }}>
          <QrReader
            onResult={handleResult}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100%" }}
          />
        </div>
      ) : (
        <div className="text-green-400 font-bold text-center">
          QR detectado:<br /> <span className="break-all">{qrValue}</span>
          <button className="mt-4 px-4 py-2 bg-blue-500 rounded text-white" onClick={handleReset}>Escanear otro</button>
        </div>
      )}
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};

export default QrAccessScanner;
