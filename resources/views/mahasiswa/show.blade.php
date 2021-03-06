@extends('adminlte::page')

@section('title', 'Mahasiswa')

@section('content_header')
<h1>Dashboard Mahasiswa</h1>
@endsection

@section('content')
<div class="row">
    <div class="col-md-12">
        <div class="box box-info">
            <div class="box-header with-border">
                <h4>Detail Mahasiswa</h4>
            </div>
            <div class="box-body">
                <table class="table" width="100%">
                    <tbody>
                        @foreach($mahasiswa as $key => $value)
                        <tr>
                            <td style="font-weight: bold">{{Str::title(str_replace('_', ' ', $key))}}</td>
                            <td>:</td>
                            @if($key == 'tanggal_lahir' && $value == "2020-01-01")
                            <td></td>
                            @elseif($key == 'tanggal_lahir')
                            <td>{{\Carbon\Carbon::parse($value)->toFormattedDateString()}}</td>
                            @else
                            <td>{{$value}}</td>
                            @endif
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
<script>
    $(document).ready(function() {
        $('#tabel_mahasiswa').DataTable({
            responsive: true,
        });
    });
</script>
@endsection

@section('css')

@endsection