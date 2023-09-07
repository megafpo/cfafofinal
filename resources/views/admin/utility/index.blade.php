@extends('admin.layouts.master')
@section('title')
frutri Utilities
@endsection

@section('content')
<div class="mt-4">
	<h2>Enable/Disable Stores</h2>
	<a href="{{ route('admin.utility.toggleStoreStatus', 'enable') }}" class="btn btn-dark btn-lg">Enable all Stores</a>
	<br><br>
	<a href="{{ route('admin.utility.toggleStoreStatus', 'disable') }}" class="btn btn-dark btn-lg">Disable all Stores</a>
	<hr>
</div>

<footer>
	More frutri utilities will be added in the future.
</footer>
@endsection