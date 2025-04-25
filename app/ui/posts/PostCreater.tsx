import LongInput from "../form/LongInput";

export default function PostCreator() {
  return (
    <div className="flex flex-col gap-4">
      {/* <h1 className="text-2xl font-extrabold">Create a Post</h1> */}
      <form className="flex flex-col gap-4">
        <LongInput
          label=""
          id="post"
          placeholder="Broadcast Now"
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Create Post
        </button>
      </form>
    </div>
  );
}
