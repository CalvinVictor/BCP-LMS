import React, { useState, useEffect } from 'react';

const CertificateButton = ({ userId, userName, courseId, courseName, rank, score, className }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [certificateUrl, setCertificateUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerateCertificate = async () => {
        if (rank > 3) {
            setError('Certificates are only available for top 3 performers');
            return;
        }

        try {
            setIsGenerating(true);
            setError(null);
            console.log('🔄 Generating certificate...');

            // Get auth token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required. Please login again.');
            }

            const requestData = {
                userId: userId,
                userName: userName || 'Unknown User',
                courseId: courseId,
                courseName: courseName || 'LMS Learning Course',
                rank: rank,
                score: score || 0
            };

            console.log('📤 Sending request:', requestData);

            const response = await fetch('http://localhost:5000/api/certificates/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add auth header
                },
                body: JSON.stringify(requestData),
            });

            console.log('📥 Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error response:', errorText);
                
                // Handle specific error cases
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please login again.');
                }
                throw new Error(errorText || 'Failed to generate certificate');
            }

            const data = await response.json();
            console.log('📥 Response data:', data);

            if (data.success && data.certificate) {
                const certificateUrl = `http://localhost:5000${data.certificate.viewUrl}`;
                console.log('🎯 Opening certificate:', certificateUrl);
                
                window.open(certificateUrl, '_blank');
                setCertificateUrl(certificateUrl);
            } else {
                throw new Error(data.message || 'Invalid response format');
            }

        } catch (err) {
            console.error('❌ Certificate generation failed:', err);
            setError(err.message || 'Failed to generate certificate. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Only show button for top 3 ranks (1, 2, or 3)
    const numericRank = typeof rank === 'string' ? parseInt(rank, 10) : rank;
    
    if (isNaN(numericRank) || numericRank > 3 || numericRank < 1) {
        return null;
    }

    return (
        <div className={`certificate-container ${className || ''}`} style={{margin: '10px 0'}}>
            <button
                onClick={handleGenerateCertificate}
                disabled={isGenerating}
                className={`certificate-btn ${isGenerating ? 'generating' : ''}`}
                style={{
                    backgroundColor: isGenerating ? '#94a3b8' : '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    opacity: isGenerating ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {isGenerating ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                            style={{
                                width: '14px',
                                height: '14px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}
                        />
                        Generating...
                    </span>
                ) : (
                    '🏆 View Certificate'
                )}
            </button>
            
            {error && (
                <div 
                    className="error-message"
                    style={{
                        marginTop: '5px',
                        color: '#dc2626',
                        fontSize: '12px',
                        textAlign: 'center'
                    }}
                >
                    {error}
                </div>
            )}
            
            {certificateUrl && (
                <div 
                    className="success-message"
                    style={{
                        marginTop: '5px',
                        color: '#16a34a',
                        fontSize: '12px',
                        textAlign: 'center'
                    }}
                >
                    Certificate generated! 🎉
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .certificate-btn:hover:not(:disabled) {
                    background-color: #2563eb !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }
            `}</style>
        </div>
    );
};

export default CertificateButton;