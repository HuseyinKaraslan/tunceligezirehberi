import CommentItem from './CommentItem'
import './CommentList.css'

function CommentList({ comments, placeId, onUpdate, onDelete }) {
  if (comments.length === 0) {
    return (
      <div className="no-comments">
        <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
      </div>
    )
  }

  return (
    <div className="comment-list">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          placeId={placeId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default CommentList



