<div class="d-flex justify-content-between align-items-center">
    <div>
        <h4 style="color: #000;font-weight: 500;" class="move-handle mb-0"> What's new in frutri </h4>
    </div>
    <div>
        @if($nonReadCount > 0) <span class="badge badge-success mr-2" id="nonReadCounter">{{ $nonReadCount }}</span>
        @endif
        <img src="{{ substr(url("/"), 0, strrpos(url("/"), '/')) }}/assets/backend/images/announcement.png"
            style=" width: 36px;transform: scaleX(-1);transform: rotate();">
    </div>
</div>
<div class="card-body px-0 pb-0">
    @if(count($frutriNews) > 0)
    @foreach ($frutriNews as $news)
    <div class="frutriSingleNewsBlock @if($news->is_read) newsRead @else newsNotRead @endif p-2 mb-2">
        <a href="{{ $news->link }}" data-id="{{ $news->id }}" class="frutriSingleNews" target="_blank">
            <div class="d-flex justify-content-between align-items-center">
                <div class="mr-2">
                    <p class="font-weight-bold mb-0 newsTitle">{{ $news->title }}</p>
                    <p class="mb-0 newsContent">{{ $news->content }}</p>
                </div>
                <div class="flex-shrink-0">
                    <img src="{{ $news->image }}" class="img-fluid">
                </div>
            </div>
        </a>
    </div>
    @endforeach
    @else
    <div class="text-center">
        <i class="icon-exclamation" style="font-size: 2.5rem; margin-top: 12px; opacity: 0.1;"></i>
        <p class="text-muted mb-0">No data to show</p>
    </div>
    @endif
</div>