package com.treino.api.treino.repository;

import com.treino.api.treino.domain.Serie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SerieRepository extends JpaRepository <Serie, Long> {}