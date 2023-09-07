<?php

namespace App\Http\Controllers;

use App\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UtilityController extends Controller
{

    public function index()
    {
        return view('admin.utility.index');
    }
    /**
     * @param $status
     */
    public function toggleStoreStatus($status)
    {
        switch ($status) {
            case 'enable':
                DB::statement("UPDATE restaurants SET is_active = '1' WHERE is_accepted = '1'");
                return redirect()->back()->with(['success' => 'All stores are enabled']);
                break;
            case 'disable':
                DB::statement("UPDATE restaurants SET is_active = '0' WHERE is_accepted = '1'");
                return redirect()->back()->with(['success' => 'All stores are disabled']);
                break;
            default:
                return redirect()->back()->with(['message' => 'Invalid Command']);
                break;
        }
    }
}
