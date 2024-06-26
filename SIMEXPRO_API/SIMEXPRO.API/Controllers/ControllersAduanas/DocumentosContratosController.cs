﻿using Microsoft.AspNetCore.Mvc;
using SIMEXPRO.BussinessLogic.Services.EventoServices;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SIMEXPRO.API.Models.ModelsAduana;
using SIMEXPRO.Entities.Entities;
using Microsoft.AspNetCore.Http;

namespace SIMEXPRO.API.Controllers.ControllersAduanas
{
    [Route("api/[controller]")]
    [ApiController]

    public class DocumentosContratosController : ControllerBase
    {
        private readonly AduanaServices _aduanaServices;
        private readonly IMapper _mapper;

        public DocumentosContratosController(AduanaServices AduanaServices, IMapper mapper)
        {
            _aduanaServices = AduanaServices;
            _mapper = mapper;
        }


        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _aduanaServices.ListarDocumentosContratos();
            listado.Data = _mapper.Map<IEnumerable<DocumentosContratosViewModel>>(listado.Data);
            return Ok(listado);
        }

        //[HttpPost("InsertarDocuComerciante")]
        //public IActionResult Insert(DocumentosContratosViewModel documentosContratosViewModel)
        //{
        //    var item = _mapper.Map<tbDocumentosContratos>(documentosContratosViewModel);
        //    var respuesta = _aduanaServices.InsertarDocumentosComerciante(item);
        //    return Ok(respuesta);
        //}

        [HttpGet("CargarDocumentosComerciante")]
        public IActionResult CargarDocumentos(int coin_Id)
        {
            var listado = _aduanaServices.CargarDocumentosComerciante(coin_Id);
            listado.Data = _mapper.Map<IEnumerable<tbDocumentosContratos>>(listado.Data);
            return Ok(listado);
        }

        [HttpPost("EditarDocuComerciante")]
        public IActionResult Update(DocumentosContratosViewModel documentosContratosViewModel)
        {
            var item = _mapper.Map<tbDocumentosContratos>(documentosContratosViewModel);
            var respuesta = _aduanaServices.ActualizarDocumentosComerciante(item);
            return Ok(respuesta);
        }

        public class MappingProfile : Profile
        {
            public MappingProfile()
            {
                CreateMap<DocumentosContratosViewModel, tbDocumentosContratos>()
                    .ForMember(dest => dest.doco_URLImagen, opt => opt.MapFrom(src => src.docoU_RLImagen));
            }
        }

        [HttpPost("InsertarDocuComerciante")]
        public IActionResult Insertar(DocumentosComercianteViewModel documentosComercianteViewModel)
        {
            var item = _mapper.Map<tbDocumentosContratos>(documentosComercianteViewModel);
            var respuesta = _aduanaServices.InsertarDocumentosComerciante(item);
            return Ok(respuesta);
        }

        public class MappingProfilee : Profile
        {
            public MappingProfilee()
            {
                CreateMap<DocumentosComercianteViewModel, tbDocumentosContratos>()
                    .ForMember(dest => dest.doco_URLImagen, opt => opt.MapFrom(src => src.docoU_RLImagen));
            }
        }


        [HttpGet("CargarDocumentosJuridica")]
        public IActionResult CargarDocumentosJuridica(int peju_Id)
        {
            var listado = _aduanaServices.CargarDocumentosJuridica(peju_Id);
            listado.Data = _mapper.Map<IEnumerable<tbDocumentosContratos>>(listado.Data);
            return Ok(listado);
        }

        [HttpPost("EditarDocuJuridica")]
        public IActionResult EditarDocuJuridica(DocumentosContratosViewModel documentosContratosViewModel)
        {
            var item = _mapper.Map<tbDocumentosContratos>(documentosContratosViewModel);
            var respuesta = _aduanaServices.EditarDocuJuridica(item);
            return Ok(respuesta);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(DocumentosContratosViewModel documentosContratosViewModel)
        {
            var item = _mapper.Map<tbDocumentosContratos>(documentosContratosViewModel);
            var respuesta = _aduanaServices.EliminarDocumentosContratos(item);
            return Ok(respuesta);
        }

        [HttpPost("EliminarByPeju_Id")]
        public IActionResult EliminarDocumentosByPeju_Id(int id)
        {
            var respuesta = _aduanaServices.EliminarDocumentosByPeju_Id(id);
            return Ok(respuesta);
        }


        [HttpPost("EliminarByCoin_Id")]
        public IActionResult EliminarDocumentosByCoin_Id(int id)
        {
            var respuesta = _aduanaServices.EliminarDocumentosByCoin_Id(id);
            return Ok(respuesta);
        }

        public class DocumentosComercianteViewModel
        {
            public int coin_Id { get; set; }
            public string docoU_RLImagen { get; set; }
            public int usua_UsuarioCreacion { get; set; }
            public DateTime doco_FechaCreacion { get; set; }
        }

        public class DocumentosContratosViewModel
        {
            public int peju_Id { get; set; }
            public string docoU_RLImagen { get; set; }
            public int usua_UsuarioCreacion { get; set; }
            public DateTime doco_FechaCreacion { get; set; }
        }



    }

}