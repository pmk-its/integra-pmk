<?php

namespace App\Http\Controllers;

use App\Event;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $events = Event::all();
        return view('event.index', compact('events'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $dates = explode('-', $request->datetime);
        $request['start_date'] = Carbon::createFromFormat('d/m/Y H:i', trim($dates[0]));
        $request['end_date'] = Carbon::createFromFormat('d/m/Y H:i', trim($dates[1]));

        do {
            $request['access_id'] = Str::random(8);
        } while (Event::where('access_id', $request['access_id'])->first());

        if($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filepath = 'eventbackground';

            $s3_filepath = Storage::disk('neo-s3')->putFileAs(
                $filepath,
                $file,
                $request['access_id'].'.'.$file->clientExtension(),
                'public'
            );
            if($s3_filepath) {
                $request['background_image'] = $s3_filepath;
            }
        }

        Event::create($request->except(['datetime', 'gambar']));

        return back();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Event  $event
     * @return \Illuminate\Http\Response
     */
    public function show(Event $event)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Event  $event
     * @return \Illuminate\Http\Response
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Event  $event
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Event $event)
    {
        $dates = explode('-', $request->datetime);
        $request['start_date'] = Carbon::createFromFormat('d/m/Y H:i', trim($dates[0]));
        $request['end_date'] = Carbon::createFromFormat('d/m/Y H:i', trim($dates[1]));

        $event->fill($request->except('datetime'));
        $event->save();

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Event  $event
     * @return \Illuminate\Http\Response
     */
    public function destroy(Event $event)
    {
        $event->delete();

        return back();
    }
}