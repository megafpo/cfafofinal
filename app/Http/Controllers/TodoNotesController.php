<?php

namespace App\Http\Controllers;

use App\TodoNote;
use Illuminate\Http\Request;
use Auth;

class TodoNotesController extends Controller
{
    public function saveTodoNote(Request $request)
    {
        $user = Auth::user();
        $todoNote = new TodoNote();
        $todoNote->data = $request->data;
        $todoNote->priority = $request->priority;
        $todoNote->user_id = $user->id;
        $todoNote->save();
        return response()->json(['success' => true, 'data' => $todoNote], 200);
    }

    public function deleteTodoNote(Request $request)
    {
        $user = Auth::user();
        $todoNote = TodoNote::where('id', $request->id)->first();
        if ($todoNote && $todoNote->user_id == $user->id) {
            $todoNote->delete();
            return response()->json(['success' => true], 200);
        }
        return response()->json(['success' => false], 400);
    }

    public function updateTodoNote(Request $request)
    {
        $user = Auth::user();
        $todoNote = TodoNote::where('id', $request->id)->first();
        if ($todoNote && $todoNote->user_id == $user->id) {
            $todoNote->data = $request->data;
            $todoNote->priority = $request->priority;
            $todoNote->save();
            return response()->json(['success' => true], 200);
        }
        return response()->json(['success' => false], 400);
    }
}
