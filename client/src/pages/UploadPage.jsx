import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
    const [title, setTitle] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!videoFile || !title) {
            alert('Пожалуйста, выберите видео и введите заголовок');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('video', videoFile);

        setIsUploading(true);

        try {
            const response = await axios.post('/userUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setIsUploading(false);
            navigate(`/room/${response.data.videoId}`);
        } catch (error) {
            console.error('Ошибка загрузки видео:', error);
            setIsUploading(false);
        }
    };

    return (
        <div className='upload-page'>
            <h2>Загрузить видео</h2>
            <form onSubmit={handleUpload}>
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Заголовок видео'
                />
                <input
                    type='file'
                    accept='video/*'
                    onChange={handleFileChange}
                />
                <button type='submit' disabled={isUploading}>
                    {isUploading ? 'Загрузка...' : 'Загрузить'}
                </button>
            </form>
        </div>
    );
};

export default UploadPage;
