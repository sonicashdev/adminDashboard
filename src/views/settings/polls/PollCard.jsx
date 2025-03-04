import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Stack, LinearProgress } from '@mui/material';
import Image from 'next/image';
import { Edit, Trash } from 'iconsax-react';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '../../../../node_modules/@mui/material/index';
import PollDialog from 'components/polls/PollDialog';

const PollCard = React.memo(({selectedAnswerIndex, poll, editingPoll, imagePreview, pollQuestion, pollAnswers, handleEditPoll, handleDeletePoll, handleUpdatePoll, setPollQuestion, setPollAnswers, setEditingPoll, setImagePreview, file, setFieldValue }) => {
  const totalVotes = poll.pollAnswers.reduce((total, answer) => total + answer.selectedCount, 0);
  const [openModal , setOpenModal] = useState(false)
  const handleCloseModal=()=>{
    setOpenModal(!openModal)
  }
  const handleOpenModal = ()=>{
    setOpenModal(true)
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {/* Poll Image */}
        <Box alignSelf="center" sx={{ width: '265px', height: '200px', borderRadius: '15px', overflow: 'hidden', mx: 'auto' }}>
          {editingPoll?._id === poll._id && imagePreview ? (
            <Image src={imagePreview} alt="New Poll" width={265} height={200} style={{ objectFit: 'contain' }} />
          ) : (
            <Image src={poll.pollImage} alt="Poll" width={265} height={200} style={{ objectFit: 'contain' }} />
          )}
        </Box>

        {/* Poll Question */}
        {editingPoll?._id === poll._id ? (
          <TextField fullWidth value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} placeholder="Enter Poll Question" />
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {poll.pollQuestion}
          </Typography>
        )}

        {/* Poll Answers */}
        <Stack spacing={2}>
          {poll.pollAnswers.map((answer, index) => {
            const percentage = totalVotes > 0 ? (answer.selectedCount / totalVotes) * 100 : 0;

            return editingPoll?._id === poll._id ? (
              <TextField
                key={index}
                fullWidth
                value={pollAnswers[index]}
                onChange={(e) => {
                  const newAnswers = [...pollAnswers];
                  newAnswers[index] = e.target.value;
                  setPollAnswers(newAnswers);
                }}
                placeholder={`Enter Answer ${index + 1}`}
              />
            ) : (
              <Box key={index} sx={{ display: 'flex', flexDirction: 'row', justifyContent: 'space-between' }}>
                <Box sx={{ flex: '1' }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {answer.answer} - {answer.selectedCount} votes
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: '10px',
                      borderRadius: '5px',
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: '5px',
                        backgroundColor: '#4caf50' // Green color for progress bar
                      }
                    }}
                  />
                </Box>
                <Button
                  onClick={() => {
                    handleOpenModal();
                  }}
                >
                  View Voters
                </Button>
                <PollDialog
          handleCloseModal={handleCloseModal}
          openModal={openModal}
          voters={poll.voters.filter((voter) => voter.votedAnswerIndex === index) }
        />
              </Box>
              
            );
          })}
        </Stack>


        {/* Edit/Delete Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {editingPoll?._id === poll._id ? (
            <>
              <Button variant="contained" onClick={handleUpdatePoll}>
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingPoll(null);
                  setImagePreview(null); // Clear the image preview on cancel
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" startIcon={<Edit size="20" />} onClick={() => handleEditPoll(poll)}>
                Edit
              </Button>
              <Button variant="contained" color="error" startIcon={<Trash size="20" />} onClick={() => handleDeletePoll(poll._id)}>
                Delete
              </Button>
            </>
          )}
        </Stack>

        {/* Image Upload for Editing */}
        {editingPoll?._id === poll._id && <SingleFileUpload file={file} setFieldValue={setFieldValue} sx={{ mb: 2 }} />}
      </Stack>
    </Box>
  );
});

PollCard.displayName = 'PollCard'; // Add display name for debugging

export default PollCard;