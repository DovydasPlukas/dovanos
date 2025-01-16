<?php

namespace App\Repositories;

use App\Models\Vendor;
use App\Repositories\Interfaces\VendorRepositoryInterface;

class VendorRepository implements VendorRepositoryInterface
{
    protected $model;

    public function __construct(Vendor $model)
    {
        $this->model = $model;
    }

    public function getAllVendors()
    {
        return $this->model->all();
    }

    public function getVendorById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function createVendor(array $data)
    {
        return $this->model->create($data);
    }

    public function updateVendor($id, array $data)
    {
        $vendor = $this->model->findOrFail($id);
        $vendor->update($data);
        return $vendor;
    }

    public function deleteVendor($id)
    {
        return $this->model->findOrFail($id)->delete();
    }
}
