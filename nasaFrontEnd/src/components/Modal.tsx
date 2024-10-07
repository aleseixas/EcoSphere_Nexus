import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Define o elemento principal da aplicação

const EnvironmentalMonitor = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleExecuteClick = () => {
    openModal();
  };

  return (
    <div>
      <h1>Environmental Monitor</h1>
      <label>Select Metric:</label>
      <select>
        <option value="deforestation">Deforestation</option>
        {/* Outras opções */}
      </select>
      <br />
      <input type="range" min="0" max="100" />
      <br />
      <button onClick={handleExecuteClick}>EXECUTE</button>

      {/* Modal Interativo */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Interactive Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <h2>Interactive Conversation</h2>
        <p>Let's talk about deforestation. How much do you think deforestation has impacted your region?</p>
        <input type="text" placeholder="Your response here..." />
        <br />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default EnvironmentalMonitor;
