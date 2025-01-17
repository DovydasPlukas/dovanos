<?php

namespace App\Repositories;

use App\Models\Attribute;
use App\Repositories\Interfaces\AttributeRepositoryInterface;

class AttributeRepository implements AttributeRepositoryInterface
{
    protected $model;

    public function __construct(Attribute $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->with('group')->get();
    }

    public function find($id)
    {
        return $this->model->with('group')->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $attribute = $this->model->findOrFail($id);
        $attribute->update($data);
        return $attribute;
    }

    public function delete($id)
    {
        $attribute = $this->model->findOrFail($id);
        return $attribute->delete();
    }

    public function findByGroup($groupId)
    {
        return $this->model->where('group_id', $groupId)->get();
    }
}
