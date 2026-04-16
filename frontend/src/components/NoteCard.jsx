const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <p className="text-gray-600 mt-2 text-sm whitespace-pre-wrap">{note.body}</p>
      </div>
      <div className="mt-4 flex justify-end gap-3 pt-4 border-t">
        <button onClick={() => onEdit(note)} className="text-blue-500 font-medium">Edit</button>
        <button onClick={() => onDelete(note._id)} className="text-red-500 font-medium">Delete</button>
      </div>
    </div>
  );
};
export default NoteCard;