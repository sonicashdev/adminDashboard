import React from 'react';
import { Grid } from '@mui/material';
import PollCard from './PollCard';

const PollList = ({ polls, editingPoll, imagePreview, pollQuestion, pollAnswers, handleEditPoll, handleDeletePoll, handleUpdatePoll, setPollQuestion, setPollAnswers, setEditingPoll, setImagePreview, file, setFieldValue }) => {
  return (
    <Grid container spacing={3}>
      {polls.map((poll) => (
        <Grid item xs={4} key={poll._id}>
          <PollCard
            poll={poll}
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
        </Grid>
      ))}
    </Grid>
  );
};

export default PollList;