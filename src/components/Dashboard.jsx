import React, { useState, useEffect } from "react";
import {
  Container, Typography, Card, CardContent, CardMedia, Modal, Box, Button,CircularProgress
} from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';
import ArticleIcon from '@mui/icons-material/Article';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import axios from "axios";
import TranslationComponent from "./Translate";
import NewsSummarizer from "./Summarize";


const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [translatedText, setTranslatedText] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    axios.get("https://newsapi.org/v2/top-headlines?country=us&apiKey=bf05e43637114d8887b06bdd5cbc40e3")
      .then(response => setNews(response.data.articles))
      .catch(error => console.error(error));
  }, []);

  // Open modal and set selected news article
  const handleOpenModal = (article) => {
    setSelectedArticle(article);
    setTranslatedText(null);  // Reset translation when opening new article
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedArticle(null);
    setSummary(null); // Reset summary when closing modal
  };

  // Handle translation
  const handleTranslate = (title, description) => {
    setTranslatedText({ title, description });
  };

  // Speech synthesis configuration function
  const speechSynthesisConfig = (utterance) => {
    utterance.volume = 1; // Max volume
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch
    utterance.lang = 'en-US'; // Set language to English (US)
  };
   
    // Close summarizer
    const handleCloseSummarizer = () => {
      setSummary(null);
    };
  // Handle summarization
  const handleSummarize = async (articleText) => {
    setLoadingSummary(true);
    try {
      const summaryResult = await NewsSummarizer(articleText);
      setSummary(summaryResult);
    } catch (error) {
      setSummary("Failed to generate summary.");
    } finally {
      setLoadingSummary(false);
    }
  };
  // Text-to-Speech function
  const handleSpeakAloud = (title, description) => {
    const readingText = [title, description]; // Array containing chunks of the text (title and description)

    const synthesis = speechSynthesis;
    let index = 0;

    const speakNextChunk = () => {
      if (index < readingText.length) {
        let utterance = new SpeechSynthesisUtterance(readingText[index]);
        speechSynthesisConfig(utterance);

        index++; // Increment the index to move to the next chunk

        // Add event listener to speak the next chunk after the current one finishes
        utterance.onend = () => {
          speakNextChunk(); // Call recursively to speak the next chunk
        };

        // Speak the current chunk
        synthesis.speak(utterance);
      }
    };

    // Start speaking from the first chunk
    speakNextChunk();
  };

  return (
    <Container>
      <Typography variant="h4">News Dashboard</Typography>
      {news.map((article, index) => (
        <Card key={index} style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handleOpenModal(article)}>
          {article.urlToImage && (
            <CardMedia component="img" height="200" image={article.urlToImage} alt={article.title} />
          )}
          <CardContent>
            <Typography variant="h6">{article.title}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {article.source.name} - {article.author || "Unknown"}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Modal for detailed view */}
      <Modal open={!!selectedArticle} onClose={handleCloseModal}>
        <Box
          sx={{
            width: { xs: '90vw', sm: 500 }, // Responsive width
            maxWidth: '95vw', // Small gap on both sides on mobile
            bgcolor: 'white',
            p: 3,
            mx: 'auto',
            boxShadow: 24,
            borderRadius: 2,
            maxHeight: '90vh', // Ensures it doesn't go off-screen
            overflowY: 'auto', // Makes it scrollable if content overflows
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {selectedArticle && (
            <>
              <Button onClick={handleCloseModal} sx={{ alignSelf: 'flex-end',mb:2 }}>X</Button>
              {selectedArticle.urlToImage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={selectedArticle.urlToImage}
                  alt={selectedArticle.title}
                  sx={{ borderRadius: 1 }} // Adds slight rounding for better UI
                />
              )}
              <Typography variant="h6">{selectedArticle.title}</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {selectedArticle.source.name} - {selectedArticle.author || "Unknown"}
              </Typography>
              <Typography variant="body2">{selectedArticle.description}</Typography>
              <Typography variant="body2" color="textSecondary">
                Published At: {new Date(selectedArticle.publishedAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="primary">
                <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">Read more</a>
              </Typography>

              {/* Buttons */}
              <Box mt={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleTranslate(selectedArticle.title, selectedArticle.description)} 
                  startIcon={<TranslateIcon />}
                >
                  Translate
                </Button>

                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<ArticleIcon />}
                  onClick={() => handleSummarize(selectedArticle.description)}

                >
                  AI Summary
                </Button>

                <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<VolumeUpIcon />}
                  onClick={() => handleSpeakAloud(selectedArticle.title, selectedArticle.description)} // Speak Aloud handler
                >
                  Speak Aloud
                </Button>
              </Box>
{/* Summary Section */}
{loadingSummary && (
  <Box
    mt={2}
    p={2}
    bgcolor="#f5f5f5"
    borderRadius={2}
    position="relative"
    boxShadow={3}
  >
    <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
  </Box>
)}

{summary && (
  <Box
    mt={2}
    p={3}
    bgcolor="#ffffff"
    borderRadius={2}
    position="relative"
    boxShadow={3}
  >
    <Button
      onClick={handleCloseSummarizer}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        minWidth: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "#ff0000",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#cc0000",
        },
      }}
    >
      X
    </Button>

    <Typography variant="h6" fontWeight="bold" color="primary">
      Summary:
    </Typography>
    <Typography variant="body2" sx={{ mt: 1, color: "#333" }}>
      {summary}
    </Typography>
  </Box>
)}



              {/* Translated text */}
              {translatedText && (
                <Box mt={2}>
                  <TranslationComponent title={translatedText.title} description={translatedText.description} />
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;
