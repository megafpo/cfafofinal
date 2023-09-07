<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\frutriNews;
use Illuminate\Http\Request;
use Ixudra\Curl\Facades\Curl;
use Illuminate\Support\Facades\Artisan;
use App\Setting;

class frutriNewsController extends Controller
{
    public function getfrutriNews()
    {
        $currentTime = Carbon::now()->timestamp;
        $lastCheckTime = Carbon::createFromTimestamp(config('setting.lastfrutriNewsFetchTime'));
        $diff = Carbon::createFromTimestamp($currentTime)->diffInMinutes($lastCheckTime);

        if (config('setting.lastfrutriNewsFetchTime') == null || $diff >= 60) {
            $url = "https://raw.githubusercontent.com/a-ssassi-n/news/main/news.json";
            $newsNotifications = Curl::to($url)->asJson()->get();

            if (count($newsNotifications) > 0) {
                $newsIdArray = [];

                foreach ($newsNotifications as $newsNotification) {
                    array_push($newsIdArray, $newsNotification->news_id);
                }

                $dataFromDb = frutriNews::whereIn('news_id', $newsIdArray)->get(['news_id'])->pluck('news_id')->toArray();
                $notInDb = array_diff($newsIdArray, $dataFromDb);

                foreach ($newsNotifications as $newsNotification) {
                    if (in_array($newsNotification->news_id, $notInDb)) {
                        $frutriNews = new frutriNews();

                        $frutriNews->news_id = $newsNotification->news_id;
                        $frutriNews->title = $newsNotification->title;
                        $frutriNews->content = $newsNotification->content;
                        $frutriNews->image = $newsNotification->image;
                        $frutriNews->link = $newsNotification->link;
                        $frutriNews->save();
                    }
                }
            }

            $setting = Setting::where('key', 'lastfrutriNewsFetchTime')->first();
            $setting->value = $currentTime;
            $setting->save();
            Artisan::call('cache:clear');
        }

        $frutriNews = frutriNews::orderBy('id', 'DESC')->get()->take(10);
        $nonReadCount = 0;
        foreach ($frutriNews as $news) {
            if (!$news->is_read) {
                $nonReadCount++;
            }
        }

        $newsRender = view('admin.partials.dashboardfrutriNews', [
            'frutriNews' => $frutriNews,
            'nonReadCount' => $nonReadCount,
        ])->render();

        $response = [
            'success' => true,
            'data' => $newsRender,
        ];

        return response()->json($response);
    }

    public function makefrutriNewsRead(Request $request)
    {
        $frutriNews = frutriNews::where('id', $request->id)->first();

        if ($frutriNews) {
            if ($frutriNews->is_read) {
                return response()->json(['success' => true, 'was_already_read' => true]);
            }
            $frutriNews->is_read = true;
            $frutriNews->save();
            return response()->json(['success' => true, 'was_already_read' => false]);
        }
    }
}
