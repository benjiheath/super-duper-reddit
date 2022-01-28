import { RequestHandler } from 'express';
import { dbComments, dbCommentsVotes } from '../../utils/dbQueries';
import { insertVoteInfoIntoComment } from '../../utils/misc';

export const updateCommentVotes: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { voteValue, commentId } = req.body;

    await dbCommentsVotes.insertRow(
      {
        vote_status: voteValue,
        user_id: req.session.userID,
        comment_id: commentId,
      },
      `ON CONFLICT (comment_id, user_id) DO UPDATE SET vote_status = '${voteValue}'`
    );

    const [comment] = await dbComments.selectAll({ whereConditions: `id = '${commentId}'` });

    const updatedComment = await insertVoteInfoIntoComment(comment, req.session.userID as string);

    res.status(200).send(updatedComment);
  } catch (err) {
    console.log('VOTES ERR', err);
    res.status(403).send(err);
  }
};
