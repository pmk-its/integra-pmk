<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo('App\User','nrp','username');
    }

    public function akk()
    {
        return $this->hasMany('App\Mahasiswa','pkk_id','nrp');
    }

    public function pkk()
    {
        return $this->belongsTo('App\Mahasiswa','pkk_id','nrp');
    }

    public function subDivisi()
    {
        return $this->belongsTo('App\SubDivisi');
    }
}