<?php

namespace App\Repositories\Interfaces;

interface VendorRepositoryInterface
{
    public function getAllVendors();
    public function getVendorById($id);
    public function createVendor(array $data);
    public function updateVendor($id, array $data);
    public function deleteVendor($id);
}
