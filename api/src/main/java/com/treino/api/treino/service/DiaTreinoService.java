package com.treino.api.treino.service;

import com.treino.api.treino.domain.DiaTreino;
import com.treino.api.treino.dto.CreateDiaTreinoRequest;
import com.treino.api.treino.dto.DiaTreinoResponse;
import com.treino.api.treino.dto.UpdateDiaTreinoRequest;
import com.treino.api.treino.exception.RecursoNaoEncontradoException;
import com.treino.api.treino.mapper.DiaTreinoMapper;
import com.treino.api.treino.repository.DiaTreinoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DiaTreinoService {

    private final DiaTreinoRepository diaTreinoRepository;

    public DiaTreinoService(DiaTreinoRepository diaTreinoRepository) {
        this.diaTreinoRepository = diaTreinoRepository;
    }

    @Transactional(readOnly = true)
    public List<DiaTreinoResponse> listarTodos() {
        return diaTreinoRepository.buscarTodosComExerciciosESeries().stream()
                .map(DiaTreinoMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DiaTreinoResponse buscarPorId(Long id) {
        DiaTreino diaTreino = buscarOuFalhar(id);
        return DiaTreinoMapper.toResponse(diaTreino);
    }

    @Transactional
    public DiaTreinoResponse criar(CreateDiaTreinoRequest request) {
        var diaTreino = new DiaTreino(request.dia(), request.nome());

        diaTreinoRepository.save(diaTreino);

        return DiaTreinoMapper.toResponse(diaTreino);
    }

    @Transactional
    public DiaTreinoResponse atualizar(Long id, UpdateDiaTreinoRequest request) {
        DiaTreino diaTreino = buscarOuFalhar(id);

        diaTreino.atualizarDados(request.dia(), request.nome());

        return DiaTreinoMapper.toResponse(diaTreino);
    }

    @Transactional
    public void deletar(Long id) {
        DiaTreino diaTreino = buscarOuFalhar(id);
        diaTreinoRepository.delete(diaTreino);
    }

    private DiaTreino buscarOuFalhar(Long id) {
        return diaTreinoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Dia de treino não encontrado com id: " + id));
    }
}
