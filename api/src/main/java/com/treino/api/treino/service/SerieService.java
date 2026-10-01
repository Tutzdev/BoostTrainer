package com.treino.api.treino.service;

import com.treino.api.treino.domain.Exercicio;
import com.treino.api.treino.domain.Serie;
import com.treino.api.treino.dto.CreateSerieRequest;
import com.treino.api.treino.dto.SerieResponse;
import com.treino.api.treino.dto.UpdateSerieRequest;
import com.treino.api.treino.exception.RecursoNaoEncontradoException;
import com.treino.api.treino.mapper.SerieMapper;
import com.treino.api.treino.repository.ExercicioRepository;
import com.treino.api.treino.repository.SerieRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SerieService {

    private final SerieRepository serieRepository;
    private final ExercicioRepository exercicioRepository;

    public SerieService(SerieRepository serieRepository,
                        ExercicioRepository exercicioRepository) {
        this.serieRepository = serieRepository;
        this.exercicioRepository = exercicioRepository;
    }

    @Transactional
    public SerieResponse adicionarAoExercicio(Long exercicioId, CreateSerieRequest request) {
        Exercicio exercicio = exercicioRepository.findById(exercicioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Exercício não encontrado com id: " + exercicioId));

        var serie = new Serie(request.repeticoes(), request.carga());
        exercicio.adicionarSerie(serie);

        serieRepository.save(serie);

        return SerieMapper.toResponse(serie);
    }

    @Transactional
    public SerieResponse atualizar(Long id, UpdateSerieRequest request) {
        Serie serie = buscarOuFalhar(id);

        serie.atualizarDados(request.numero(), request.repeticoes(), request.carga());

        return SerieMapper.toResponse(serie);
    }

    @Transactional
    public void deletar(Long id) {
        Serie serie = buscarOuFalhar(id);
        serieRepository.delete(serie);
    }

    private Serie buscarOuFalhar(Long id) {
        return serieRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Série não encontrada com id: " + id));
    }
}
