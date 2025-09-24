<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class EventCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = EventResource::class;

    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'data' => $this->collection,
        ];

        // Add pagination metadata if the collection is paginated
        if ($this->resource instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
            $data['pagination'] = [
                'current_page' => $this->resource->currentPage(),
                'last_page' => $this->resource->lastPage(),
                'per_page' => $this->resource->perPage(),
                'total' => $this->resource->total(),
                'from' => $this->resource->firstItem(),
                'to' => $this->resource->lastItem(),
                'has_more_pages' => $this->resource->hasMorePages(),
                'prev_page_url' => $this->resource->previousPageUrl(),
                'next_page_url' => $this->resource->nextPageUrl(),
            ];
        }

        // Add metadata
        $data['meta'] = [
            'count' => $this->collection->count(),
            'total_count' => $this->resource instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator
                ? $this->resource->total()
                : $this->collection->count(),
            'filters' => [
                'family_id' => $request->input('family_id'),
                'user_id' => $request->input('user_id'),
                'category_id' => $request->input('category_id'),
                'date_from' => $request->input('date_from'),
                'date_to' => $request->input('date_to'),
                'is_urgent' => $request->input('is_urgent'),
                'search' => $request->input('search'),
            ],
            'includes' => array_filter([
                $request->has('include_user') ? 'user' : null,
                $request->has('include_comments') ? 'comments' : null,
                $request->has('include_tags') ? 'tags' : null,
                $request->has('include_category') ? 'category' : null,
                $request->has('include_family') ? 'family' : null,
            ]),
        ];

        return $data;
    }
}
