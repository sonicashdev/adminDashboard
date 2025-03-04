'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, FormControl, InputLabel, Typography, Stack, IconButton } from '@mui/material';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';
import { Select } from '@mui/material';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile'; // Import the SingleFileUpload component
import {MinusCirlce} from 'iconsax-react'; // Import the delete icon

export default function CreatePlan() {
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollAnswers, setPollAnswers] = useState(['']); // Initialize with one empty answer
  const [pollImage, setPollImage] = useState(null); // For the image upload
  const [imagePreview, setImagePreview] = useState(null); // For the image preview
  const [file, setFile] = useState(null); // For the SingleFileUpload component

  // Function to add a new answer input field
  const addAnswerField = () => {
    setPollAnswers([...pollAnswers, '']);
  };

  // Function to handle changes in answer fields
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...pollAnswers];
    newAnswers[index] = value;
    setPollAnswers(newAnswers);
  };

  // Function to delete an answer field
  const deleteAnswerField = (index) => {
    if (index === 0) return; // Prevent deleting the first answer
    const newAnswers = pollAnswers.filter((_, i) => i !== index);
    setPollAnswers(newAnswers);
  };

  // Handle form submission to create a new plan
  const handleCreatePlan = async () => {
    if (!pollQuestion || pollAnswers.some(answer => answer.trim() === '')) {
      toast.error('Please fill out all the fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pollQuestion', pollQuestion);
      pollAnswers.forEach((answer, index) => {
        formData.append(`pollAnswers[${index}]`, answer);
      });
      if (pollImage) {
        formData.append('pollImage', pollImage); // Append image if it's selected
      }

      // Send new plan data to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/poll/create-poll`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // Handle success
      toast.success('Banner Data Added successfully!');

      // Reset form fields after successful creation
      setPollQuestion('');
      setPollAnswers(['']);
      setPollImage(null);
      setImagePreview(null); // Clear the image preview
      setFile(null); // Clear the file state

    } catch (error) {
      console.log(error);
      toast.error('Error adding banner data');
    }
  };

  // Handle file selection in SingleFileUpload
  const setFieldValue = (field, value) => {
    if (field === 'files') {
      setFile(value); // Update the file state for SingleFileUpload
      if (value && value.length > 0) {
        setPollImage(value[0]); // Update planImage state with the first file
        setImagePreview(URL.createObjectURL(value[0])); // Update the preview
      } else {
        setPollImage(null); // Clear planImage if no file is selected
        setImagePreview(null); // Clear the preview
      }
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', py: 3 }}>
      <Toaster position="top-center" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Create New Poll">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>Poll Question: </InputLabel>
                  <TextField
                    placeholder="Enter The Poll Question"
                    fullWidth
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                  />
                    <SingleFileUpload
                    file={file} // Pass the file state
                    setFieldValue={setFieldValue} // Pass the setFieldValue function
                    sx={{ mb: 2 }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>Poll Answers: </InputLabel>
                  {pollAnswers.map((answer, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                      <TextField
                        placeholder={`Enter Answer ${index + 1}`}
                        fullWidth
                        value={answer}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      {index !== 0 && ( // Only show delete button for non-first answers
                        <IconButton
                          color="error"
                          onClick={() => deleteAnswerField(index)}
                          sx={{ mb: 2 }}
                        >
                          <MinusCirlce size="32" color="#f47373"/>
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                  <Button variant="contained" onClick={addAnswerField}>
                    Add Answer
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleCreatePlan}>
                    Create Poll
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
}