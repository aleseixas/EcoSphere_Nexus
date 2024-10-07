import React from 'react';

interface EcosystemProfileProps {
    className?:string;
    name: string;
    image: string;
    description: string;
}

const EcosystemProfile: React.FC<EcosystemProfileProps> = ({ name, image, description }) => {
    return (
        <div style={styles.container}>
            <h2>{name}</h2>
            <img src={image} alt={name} style={styles.image} />
            {/* A borda agora envolve apenas a descrição */}
            <div style={styles.descriptionContainer}>
                <p>{description}</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        margin: '16px',
        textAlign: 'center' as 'center',
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
    },
    descriptionContainer: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '16px',
    },
};

export default EcosystemProfile;