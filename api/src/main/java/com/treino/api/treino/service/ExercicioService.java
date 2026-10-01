package com.treino.api.treino.service;

import com.treino.api.treino.domain.DiaTreino;
import com.treino.api.treino.domain.Exercicio;
import com.treino.api.treino.dto.CreateExercicioRequest;
import com.treino.api.treino.dto.ExercicioResponse;
import com.treino.api.treino.dto.UpdateExercicioRequest;
import com.treino.api.treino.exception.RecursoNaoEncontradoException;
import com.treino.api.treino.mapper.ExercicioMapper;
import com.treino.api.treino.repository.DiaTreinoRepository;
import com.treino.api.treino.repository.ExercicioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExercicioService {

    private final ExercicioRepository exercicioRepository;
    private final DiaTreinoRepository diaTreinoRepository;

    public ExercicioService(ExercicioRepository exercicioRepository,
                            DiaTreinoRepository diaTreinoRepository) {
        this.exercicioRepository = exercicioRepository;
        this.diaTreinoRepository = diaTreinoRepository;
    }

    @Transactional
    public ExercicioResponse adicionarAoDiaTreino(Long diaTreinoId, CreateExercicioRequest request) {
        DiaTreino diaTreino = diaTreinoRepository.findById(diaTreinoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Dia de treino não encontrado com id: " + diaTreinoId));

        var exercicio = new Exercicio(request.nome(), request.observacao());
        diaTreino.adicionarExercicio(exercicio);

        exercicioRepository.save(exercicio);

        return ExercicioMapper.toResponse(exercicio);
    }

    @Transactional
    public ExercicioResponse atualizar(Long id, UpdateExercicioRequest request) {
        Exercicio exercicio = buscarOuFalhar(id);

        exercicio.atualizarDados(request.nome(), request.observacao());

        return ExercicioMapper.toResponse(exercicio);
    }

    @Transactional
    public void deletar(Long id) {
        Exercicio exercicio = buscarOuFalhar(id);
        exercicioRepository.delete(exercicio);
    }

    private Exercicio buscarOuFalhar(Long id) {
        return exercicioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Exercício não encontrado com id: " + id));
    }
}
