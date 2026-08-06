'use client';

import { useState, useEffect } from 'react';
import { institutionModuleService, InstitutionModuleAssignment } from '@/services/institution-module.service';
import { moduleService, Module } from '@/services/module.service';
import { purchaseService, Purchase } from '@/services/purchase.service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FiBook, FiCheckCircle, FiXCircle, FiTrash2, FiGlobe } from 'react-icons/fi';
import { Classroom } from '@/types/institution.types';
import Swal from 'sweetalert2';

interface AssignedModulesProps {
  institutionId: string;
  classroomsByBranch: Record<string, Classroom[]>;
}

export function AssignedModules({ institutionId, classroomsByBranch }: AssignedModulesProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<InstitutionModuleAssignment[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedClassroomIds, setSelectedClassroomIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Flatten all classrooms for the multiselect
  const allClassrooms = Object.entries(classroomsByBranch).flatMap(([branchId, classrooms]) => classrooms);

  useEffect(() => {
    if (institutionId) {
      loadData();
    }
  }, [institutionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [modulesData, assignmentsData, purchasesData] = await Promise.all([
        moduleService.getAllModules(),
        institutionModuleService.getInstitutionModules(institutionId),
        purchaseService.getInstitutionPurchases(institutionId)
      ]);
      setModules(modulesData);
      setAssignments(assignmentsData);
      setPurchases(purchasesData);
    } catch (error) {
      console.error('Error loading modules data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) return;

    setSaving(true);
    const res = await institutionModuleService.assignModule(institutionId, selectedModuleId, selectedClassroomIds);
    setSaving(false);

    if (res.success) {
      setSelectedModuleId('');
      setSelectedClassroomIds([]);
      Swal.fire({
        title: 'Asignado',
        text: 'Módulo asignado correctamente',
        icon: 'success',
        confirmButtonColor: '#9333EA' // purple-600
      });
      loadData();
    } else {
      Swal.fire({
        title: 'Error',
        text: res.message || 'No se pudo asignar el módulo',
        icon: 'error',
        confirmButtonColor: '#EF4444' // red-500
      });
    }
  };

  const handleRemove = async (moduleId: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que deseas remover este módulo de la institución?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    setSaving(true);
    const res = await institutionModuleService.removeModule(institutionId, moduleId);
    setSaving(false);

    if (res.success) {
      Swal.fire({
        title: 'Removido',
        text: 'El módulo fue removido correctamente',
        icon: 'success',
        confirmButtonColor: '#9333EA'
      });
      loadData();
    } else {
      Swal.fire({
        title: 'Error',
        text: res.message || 'No se pudo remover el módulo',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const availableModulesToAssign = modules.filter(
    m => purchases.some(p => p.module_id === m._id) && !assignments.some(a => a.moduleId === m._id)
  );

  return (
    <section className="rounded-xl bg-white dark:bg-[#1C1D1F] p-6 shadow-sm space-y-6 mt-6 border border-gray-100 dark:border-slate-800">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FiBook className="w-5 h-5 text-purple-600" />
          Módulos Asignados
        </h2>
        <p className="text-sm text-gray-500">
          Asigna módulos a toda la institución o restríngelos a salones específicos.
        </p>
      </div>

      <form onSubmit={handleAssign} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 grid gap-4 md:grid-cols-3 items-start">
        <div>
          <Label htmlFor="module-select">Seleccionar Módulo</Label>
          <select
            id="module-select"
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          >
            <option value="">-- Elige un módulo --</option>
            {availableModulesToAssign.map(m => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-1">
          <Label htmlFor="classroom-select">Restringir a salones (opcional)</Label>
          <select
            id="classroom-select"
            multiple
            value={selectedClassroomIds}
            onChange={(e) => setSelectedClassroomIds(Array.from(e.target.selectedOptions, o => o.value))}
            className="mt-2 w-full min-h-24 rounded-md border border-gray-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          >
            {allClassrooms.map(c => (
              <option key={c.id || c._id} value={c.id || c._id}>{c.name} ({c.code})</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">Si dejas esto vacío, toda la institución tendrá acceso.</p>
        </div>

        <div className="md:pt-8">
          <Button type="submit" disabled={saving || !selectedModuleId || availableModulesToAssign.length === 0} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            {saving ? 'Asignando...' : 'Asignar Módulo'}
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500">Cargando módulos asignados...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No hay módulos asignados a esta institución.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map(assignment => {
              const moduleInfo = modules.find(m => m._id === assignment.moduleId);
              const restricted = assignment.classroomIds.length > 0;
              return (
                <div key={assignment._id} className="border border-slate-200 rounded-lg p-4 bg-white relative group flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 pr-8 line-clamp-2" title={moduleInfo?.title}>
                      {moduleInfo?.title || 'Módulo desconocido'}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
                      {restricted ? (
                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          {assignment.classroomIds.length} salones permitidos
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          <FiGlobe className="w-3.5 h-3.5" />
                          Toda la institución
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(assignment.moduleId)}
                    disabled={saving}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Remover módulo"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
