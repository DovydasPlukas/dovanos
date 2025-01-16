<?php

namespace App\Services;

use App\Repositories\Interfaces\VendorRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class VendorService
{
    protected $vendorRepository;

    public function __construct(VendorRepositoryInterface $vendorRepository)
    {
        $this->vendorRepository = $vendorRepository;
    }

    public function getAllVendors()
    {
        return $this->vendorRepository->getAllVendors();
    }

    public function getVendor($id)
    {
        return $this->vendorRepository->getVendorById($id);
    }

    public function createVendor(array $data)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        return $this->vendorRepository->createVendor($data);
    }

    public function updateVendor($id, array $data)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        return $this->vendorRepository->updateVendor($id, $data);
    }

    public function deleteVendor($id)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        return $this->vendorRepository->deleteVendor($id);
    }
}
