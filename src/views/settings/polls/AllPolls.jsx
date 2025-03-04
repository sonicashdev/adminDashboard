'use client'
import { useEffect, useState, useCallback } from 'react';
import { Box, Button, Grid, Typography, Stack } from '@mui/material';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';
import PollList from './PollList';
import { useAuthStore } from 'store/authStore';

const CreatePlan = () => {
  const [polls, setPolls] = useState([]);
  const [editingPoll, setEditingPoll] = useState(null);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollAnswers, setPollAnswers] = useState([]);
  const [pollImage, setPollImage] = useState(null);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
 const { deletePoll , getAllPolls , updatePoll} = useAuthStore()
  // Fetch polls from the backend
  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = useCallback(async () => {
    try {
      const response = await getAllPolls()
      console.log(response.data)
      setPolls(response.data.allPolls);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  }, []);

  // Handle delete poll
  const handleDeletePoll = useCallback(async (pollId) => {
    try {
      const response = await deletePoll(pollId)
      console.log(response)
      toast.success('Poll deleted successfully!');
       // Refresh the list of polls
       setPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== pollId));
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast.error('Failed to delete poll');
    }
  }, []);

  // Handle edit poll
  const handleEditPoll = useCallback((poll) => {
    setEditingPoll(poll);
    setPollQuestion(poll.pollQuestion);
    setPollAnswers(poll.pollAnswers.map((a) => a.answer));
    setPollImage(poll.pollImage);
    setFile(null);
    setImagePreview(null);
  }, []);

  // Handle update poll
  const handleUpdatePoll = useCallback(async () => {
    try {
      const formData = new FormData();
  
      // Append the poll question if it has changed
      formData.append('pollQuestion', pollQuestion);
  
      // Ensure pollAnswers is formatted properly (an array of objects with `answer` and `selectedCount`)
      const formattedAnswers = pollAnswers.map(answer => ({
        answer,
        selectedCount: 0 // Assuming we are starting with 0 count. Adjust if necessary.
      }));
      formData.append('pollAnswers', JSON.stringify(formattedAnswers));
  
      // Append the new image if uploaded, otherwise, retain the current one
      if (file) {
        formData.append('pollImage', file);
      } else if (pollImage) {
        formData.append('pollImage', pollImage); // Ensure we keep the old image if not updated
      }
  
      // Send the updated data to the backend
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/poll/update-poll/${editingPoll._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      console.log(response.data);
      toast.success('Poll updated successfully!');
      fetchPolls(); // Refresh the list of polls
  
      // Reset form fields after successful update
      setEditingPoll(null);
      setPollQuestion('');
      setPollAnswers([]);
      setPollImage(null);
      setFile(null);
      setImagePreview(null);
  
    } catch (error) {
      console.error('Error updating poll:', error);
      toast.error('Error updating poll');
    }
  }, [pollQuestion, pollAnswers, file, pollImage, editingPoll, fetchPolls]);
  

  // Handle file selection
  const setFieldValue = useCallback((field, value) => {
    if (field === 'files') {
      setFile(value);
      if (value && value.length > 0) {
        setImagePreview(URL.createObjectURL(value[0]));
      } else {
        setImagePreview(null);
      }
    }
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', py: 3 }}>
      <Toaster position="top-center" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Polls">
            <PollList
              polls={polls}
              editingPoll={editingPoll}
              imagePreview={imagePreview}
              pollQuestion={pollQuestion}
              pollAnswers={pollAnswers}
              handleEditPoll={handleEditPoll}
              handleDeletePoll={handleDeletePoll}
              handleUpdatePoll={handleUpdatePoll}
              setPollQuestion={setPollQuestion}
              setPollAnswers={setPollAnswers}
              setImagePreview={setImagePreview}
              setEditingPoll={setEditingPoll}
              file={file}
              setFieldValue={setFieldValue}
            />
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatePlan;