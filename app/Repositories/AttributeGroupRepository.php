<?php

namespace App\Repositories;

use App\Models\AttributeGroup;
use App\Repositories\Interfaces\AttributeGroupRepositoryInterface;

class AttributeGroupRepository implements AttributeGroupRepositoryInterface
{
    protected $model;

    public function __construct(AttributeGroup $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->orderBy('name')->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $group = $this->find($id);
        $group->update($data);
        return $group;
    }

    public function delete($id)
    {
        return $this->model->destroy($id);
    }

    public function getWithAttributes()
    {
        return $this->model->with('attributes')->get();
    }
}
