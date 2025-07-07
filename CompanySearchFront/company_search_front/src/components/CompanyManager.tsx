import { useState, useEffect } from 'react';
import { CompanyForm } from './CompanyForm';
import { DeleteConfirmation } from './DeleteConfirmation';
import { Modal } from './Modal';
import { useCompanyCrud } from '../hooks/useCompanyCrud';
import { useToastContext } from '../hooks/useToastContext';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company';

interface CompanyManagerProps {
    onCompanyChange?: () => void;
}

export function CompanyManager({ onCompanyChange }: CompanyManagerProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

    const {
        isCreating,
        isUpdating,
        isDeleting,
        error,
        createCompany,
        updateCompany,
        deleteCompany,
        clearError
    } = useCompanyCrud();

    const { success, error: showError } = useToastContext();

    useEffect(() => {
        const handleEditCompany = (event: CustomEvent<Company>) => {
            openEditModal(event.detail);
        };

        const handleDeleteCompany = (event: CustomEvent<Company>) => {
            openDeleteModal(event.detail);
        };

        window.addEventListener('editCompany', handleEditCompany as EventListener);
        window.addEventListener('deleteCompany', handleDeleteCompany as EventListener);

        return () => {
            window.removeEventListener('editCompany', handleEditCompany as EventListener);
            window.removeEventListener('deleteCompany', handleDeleteCompany as EventListener);
        };
    }, []);

    const handleCreate = async (data: CreateCompanyDto) => {
        const result = await createCompany(data);
        if (result) {
            setIsCreateModalOpen(false);
            success('Compañía creada', 'La compañía se ha creado exitosamente');
            onCompanyChange?.();
        } else if (error) {
            showError('Error al crear', error);
        }
    };

    const handleEdit = async (data: UpdateCompanyDto) => {
        if (!selectedCompany) return;

        const result = await updateCompany(selectedCompany.id, data);
        if (result) {
            setIsEditModalOpen(false);
            setSelectedCompany(null);
            success('Compañía actualizada', 'La compañía se ha actualizado exitosamente');
            onCompanyChange?.();
        } else if (error) {
            showError('Error al actualizar', error);
        }
    };

    const handleCreateSubmit = async (data: CreateCompanyDto | UpdateCompanyDto) => {
        await handleCreate(data as CreateCompanyDto);
    };

    const handleEditSubmit = async (data: CreateCompanyDto | UpdateCompanyDto) => {
        await handleEdit(data as UpdateCompanyDto);
    };

    const handleDelete = async () => {
        if (!companyToDelete) return;

        const result = await deleteCompany(companyToDelete.id);
        if (result) {
            setIsDeleteModalOpen(false);
            setCompanyToDelete(null);
            success('Compañía eliminada', 'La compañía se ha eliminado exitosamente');
            onCompanyChange?.();
        } else if (error) {
            showError('Error al eliminar', error);
        }
    };

    const openCreateModal = () => {
        clearError();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (company: Company) => {
        clearError();
        setSelectedCompany(company);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (company: Company) => {
        clearError();
        setCompanyToDelete(company);
        setIsDeleteModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        clearError();
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCompany(null);
        clearError();
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCompanyToDelete(null);
        clearError();
    };

    return (
        <>
            <button
                onClick={openCreateModal}
                className="fab"
                title="Crear nueva compañía"
                aria-label="Crear nueva compañía"
            >
                +
            </button>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                size="medium"
            >
                <CompanyForm
                    isLoading={isCreating}
                    onSubmit={handleCreateSubmit}
                    onCancel={closeCreateModal}
                />
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                size="medium"
            >
                <CompanyForm
                    company={selectedCompany || undefined}
                    isLoading={isUpdating}
                    onSubmit={handleEditSubmit}
                    onCancel={closeEditModal}
                />
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                size="small"
            >
                <DeleteConfirmation
                    companyName={companyToDelete?.name || ''}
                    isLoading={isDeleting}
                    onConfirm={handleDelete}
                    onCancel={closeDeleteModal}
                />
            </Modal>
        </>
    );
}